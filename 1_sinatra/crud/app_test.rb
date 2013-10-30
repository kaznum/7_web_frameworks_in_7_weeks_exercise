require_relative 'app'
require 'rspec'
require 'rack/test'

describe "Bookmark application" do
  include Rack::Test::Methods
  def app
    Sinatra::Application
  end

  it "creates a new bookmark" do
    get "/bookmarks"
    bookmarks = JSON.parse(last_response.body)
    last_size = bookmarks.size

    post "/bookmarks", { url: "http://www.test.com", title: "Test" }
    last_response.status.should == 201
    last_response.body.should match (/\/bookmarks\/\d+/)

    get "bookmarks"
    bookmarks = JSON.parse(last_response.body)
    expect(bookmarks.size).to eq(last_size + 1)
  end

  it "updates a bookmark" do
    post '/bookmarks', { url: "http://www.est.com", title: "Test" }
    bookmark_url = last_response.body
    id = bookmark_url.split("/").last

    put "/bookmarks/#{id}", { title: "Success" }
    last_response.status.should == 204

    get "/bookmarks/#{id}"
    retrieved_bookmark = JSON.parse(last_response.body)
    expect(retrieved_bookmark["title"]).to eq("Success")
  end

  it "deletes a bookmark" do
    post '/bookmarks', { url: "http://www.est.com", title: "Test" }
    bookmark_url = last_response.body
    id = bookmark_url.split("/").last

    get '/bookmarks'
    bookmarks = JSON.parse(last_response.body)
    last_size = bookmarks.size

    delete "/bookmarks/#{id}"
    last_response.status.should == 200

    get '/bookmarks'
    bookmarks = JSON.parse(last_response.body)
    expect(bookmarks.size).to eq(last_size - 1)
  end
end
