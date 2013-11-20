require 'sinatra'
require 'data_mapper'
require 'dm-serializer'
require 'sinatra/respond_with'
require 'slim'
require_relative 'bookmark'

DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/bookmarks.db")
DataMapper::finalize.auto_upgrade!

before "/bookmarks/:id" do |id|
  @bookmark = Bookmark.get(id)
  if !@bookmark
    halt 404, "bookmark #{id} not found"
  end
end

def get_all_bookmarks
  Bookmark.all(order: :title)
end

get "/" do
  @bookmarks = get_all_bookmarks
  slim :bookmark_list
end

get "/bookmarks" do
  @bookmarks = get_all_bookmarks
  respond_with :bookmark_list, @bookmarks
end

post "/bookmarks" do
  input = params.slice "url", "title"
  bookmark = Bookmark.new input
  if bookmark.save
    [201, "/bookmarks/#{bookmark['id']}"]
  else
    400 #bad request
  end
end

class Hash
  def slice(*whitelist)
    whitelist.inject({}) { |result, key| result.merge(key => self[key])}
  end
end

get "/bookmarks/:id" do |id|
  @bookmark = Bookmark.get(id)
  respond_with :bookmark_form_edit, @bookmark
end

get "/test/:one/:two" do |creature, sound|
  "a #{creature} says #{sound}"
end

put "/bookmarks/:id" do
  input = params.slice "url", "title"
  if @bookmark.update input
    204 # No Content
  else
    400 # bad request
  end
end


delete "/bookmarks/:id" do
  id = params[:id]
  bookmark = Bookmark.get(id)
  bookmark.destroy
  200
end

get "/bookmark/new" do
  slim :bookmark_form_new
end

helpers do
  def h(text)
    Rack::Utils.escape_html(text)
  end
end
