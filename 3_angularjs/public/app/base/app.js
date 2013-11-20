(function (app) {

  app.factory("Bookmark", function ($resource) {
    return $resource("/bookmarks/:id", {id: "@id"});
  });

  app.factory("bookmarks", function(Bookmark) {
    return Bookmark.query();
  });

  app.factory("saveBookmark", function(bookmarks) {
    return function (bookmark) {
      if (!bookmark.id) {
        bookmarks.push(bookmark);
      }
      bookmark.$save();
    };
  });

  app.factory("deleteBookmark", function (bookmarks) {
    return function(bookmark) {
      var index = bookmarks.indexOf(bookmark);
      bookmark.$delete();
      bookmarks.splice(index, 1);
    };
  });

})(
  angular.module("App_base", ["ngResource"])
);
