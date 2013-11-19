require_relative 'app'
require 'rspec'
require 'rack/test'
require 'json'

describe "Bookmark application" do
  include Rack::Test::Methods
  def app
    Sinatra::Application
  end

  it "creates a new bookmark" do
    header "Accept", "application/json"
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

  it "sends an error code for an invalid create request" do
    post "/bookmarks", { url: "test", title: "Test" }
    last_response.status.should == 400
  end

  it "updates a bookmark" do
    header "Accept", "application/json"
    post '/bookmarks', { url: "http://www.test.com", title: "Test" }
    bookmark_url = last_response.body
    id = bookmark_url.split("/").last

    header "Accept", "application/json"
    put "/bookmarks/#{id}", { url: "http://www.test2.com", title: "Success" }
    last_response.status.should == 204

    header "Accept", "application/json"
    get "/bookmarks/#{id}"
    retrieved_bookmark = JSON.parse(last_response.body)
    expect(retrieved_bookmark["title"]).to eq("Success")
    expect(retrieved_bookmark["url"]).to eq("http://www.test2.com")
  end

  it "sends an error code for an invalid update request" do
    header "Accept", "application/json"
    get "/bookmarks"
    bookmarks = JSON.parse(last_response.body)
    id = bookmarks.first['id']

    put "/bookmarks/#{id}", {url: "Invalid" }
    last_response.status.should == 400
  end

  it "deletes a bookmark" do
    header "Accept", "application/json"
    post '/bookmarks', { url: "http://www.test.com", title: "Test" }
    bookmark_url = last_response.body
    id = bookmark_url.split("/").last

    header "Accept", "application/json"
    get '/bookmarks'
    bookmarks = JSON.parse(last_response.body)
    last_size = bookmarks.size

    header "Accept", "application/json"
    delete "/bookmarks/#{id}"
    last_response.status.should == 200

    header "Accept", "application/json"
    get '/bookmarks'
    bookmarks = JSON.parse(last_response.body)
    expect(bookmarks.size).to eq(last_size - 1)
  end
end
