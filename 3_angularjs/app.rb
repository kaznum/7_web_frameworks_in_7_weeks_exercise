require 'sinatra'
require 'data_mapper'
require 'dm-serializer'
require 'sinatra/respond_with'
require 'slim'
require_relative 'bookmark'
require_relative 'tagging'
require_relative 'tag'
require 'json'

DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/bookmarks.db")
DataMapper::finalize.auto_upgrade!

before %r{/bookmarks/(\d+)} do |id|
  @bookmark = Bookmark.get(id.to_i)
  if !@bookmark
    halt 404, "bookmark #{id} not found"
  end
end

with_tagList = {methods: [:tagList]}

def get_all_bookmarks
  Bookmark.all(order: :title)
end

get "/" do
  @bookmarks = get_all_bookmarks
  slim :index
end

get "/bookmarks" do
  content_type :json
  get_all_bookmarks.to_json with_tagList
end


post "/bookmarks" do
  input = params.empty? ? JSON.parse(request.body.read) : params

  bookmark = Bookmark.new input.only("url", "title")
  if bookmark.save
    add_tags(bookmark, input)
    [201, bookmark.to_json(with_tagList)]
  else
    400 #bad request
  end
end

class Hash
  def only(*whitelist)
    whitelist.inject({}) { |result, key| result.merge(key => self[key])}
  end
end

get %r{/bookmarks/\d+} do
  content_type :json
  @bookmark.to_json with_tagList
end


get "/bookmarks/*" do
  tags = params[:splat].first.split '/'
  bookmarks = Bookmark.all
  tags.each do |tag|
    bookmarks = bookmarks.all({ taggings: { tag: { label: tag }}})
  end
  bookmarks.to_json with_tagList
end

get "/test/:one/:two" do |creature, sound|
  "a #{creature} says #{sound}"
end

post %r{/bookmarks/\d+} do
  input = params.empty? ? JSON.parse(request.body.read) : params

  if @bookmark.update input.only("url", "title")
    add_tags(@bookmark, input)
    200 #OK
  else
    400 # bad request
  end
end


delete %r{/bookmarks/\d+} do
  @bookmark.destroy
  200
end

get "/bookmark/new" do
  slim :bookmark_form_new
end

helpers do
  def h(text)
    Rack::Utils.escape_html(text)
  end

  def add_tags(bookmark, input)
    labels = input["tagList"].is_a?(String) ? input["tagList"].split(',').map(&:strip) : (input["tagList"] || []).map(&:strip)

    existing_labels = []
    bookmark.taggings.each do |tagging|
      if labels.include? tagging.tag.label
        existing_labels.push tagging.tag.label
      else
        tagging.destroy
      end
    end

    (labels - existing_labels).each do |label|
      tag = { label: label }
      existing = Tag.first tag
      if !existing
        existing = Tag.create tag
      end
      Tagging.create tag: existing, bookmark: bookmark
    end
  end
end

