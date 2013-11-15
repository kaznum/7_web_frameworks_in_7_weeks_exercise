require 'sinatra'
require 'data_mapper'
require 'dm-serializer'
require 'sinatra/respond_with'
require_relative 'bookmark'

DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/bookmarks.db")
DataMapper::finalize.auto_upgrade!

def get_all_bookmarks
  Bookmark.all(order: :title)
end

get "/" do
  @bookmarks = get_all_bookmarks
  erb :bookmark_list
end

get "/bookmarks" do
  @bookmark = get_all_bookmarks
  respond_with :bookmark_list, @bookmarks
end

post "/bookmarks" do
  input = params.slice "url", "title"
  bookmark = Bookmark.create input
  [201, "/bookmarks/#{bookmark['id']}"]
end

class Hash
  def slice(*whitelist)
    whitelist.inject({}) { |result, key| result.merge(key => self[key])}
  end
end

get "/bookmarks/:id" do
  id = params[:id]
  bookmark = Bookmark.get(id)
  content_type :json
  bookmark.to_json
end

put "/bookmarks/:id" do
  id = params[:id]
  bookmark = Bookmark.get(id)
  input = params.slice "url", "title"
  bookmark.update input
  204 # No Content
end


delete "/bookmarks/:id" do
  id = params[:id]
  bookmark = Bookmark.get(id)
  bookmark.destroy
  200
end

get "/bookmark/new" do
  erb :bookmark_form_new
end

helpers do
  def h(text)
    Rack::Utils.escape_html(text)
  end
end
