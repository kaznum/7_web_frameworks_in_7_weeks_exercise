describe("base/app-test.js", function () {
  beforeEach(function () {
    module("App_base");
  });

  describe("Bookmark resource", function () {
    var mockBookmarks = null;

    beforeEach(inject(function($httpBackend, Bookmark) {
      mockBookmarks = [
        new Bookmark({id:1}), new Bookmark({id:2}), new Bookmark({id:3})
      ];
      $httpBackend.expectGET("/bookmarks").respond(mockBookmarks);
    }));

    it("should retrieve bookmarks", inject(function($httpBackend, bookmarks) {
         $httpBackend.flush();
         expect(bookmarks.length).toBe(mockBookmarks.length);
    }));

    it("should save a bookmark", inject(function ($httpBackend, Bookmark, bookmarks, saveBookmark) {
      $httpBackend.flush();
      $httpBackend.expectPOST("/bookmarks").respond({id:4});
      saveBookmark(new Bookmark({url: "http://angularjs.org", title: "AngularJS"}));
      $httpBackend.flush();
      expect(bookmarks.length).toBe(mockBookmarks.length + 1);
    }));

    it("should delete a bookmark", inject(function($httpBackend, bookmarks, deleteBookmark) {
      $httpBackend.flush();
      var bookmark = bookmarks[0];
      $httpBackend.expectDELETE("/bookmarks/" + bookmark.id).respond(200);
      deleteBookmark(bookmark);
      $httpBackend.flush();
      expect(bookmarks.length).toBe(mockBookmarks.length - 1);
    }));
  });
});
