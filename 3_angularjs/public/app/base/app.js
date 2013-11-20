(function (app) {

  app.factory("Bookmark", function ($resource) {
    return $resource("/bookmarks/:id", {id: "@id"});
  });

  app.factory("bookmarks", function(Bookmark) {
    return Bookmark.query();
  });

  app.factory("saveBookmark", function(bookmarks, state) {
    return function (bookmark) {
      if (!bookmark.id) {
        bookmarks.push(bookmark);
      }
      bookmark.$save();
      state.clearForm();
    };
  });

  app.factory("deleteBookmark", function (bookmarks) {
    return function(bookmark) {
      var index = bookmarks.indexOf(bookmark);
      bookmark.$delete();
      bookmarks.splice(index, 1);
    };
  });

  app.controller("BookmarkListController", function ($scope, bookmarks, deleteBookmark, editBookmark) {
    $scope.bookmarks = bookmarks;
    $scope.deleteBookmark = deleteBookmark;
    $scope.editBookmark = editBookmark;
  });

  app.service("state", function (Bookmark) {
    this.formBookmark = {bookmark:new Bookmark()};
    this.clearForm = function() {
      this.formBookmark.bookmark = new Bookmark();
    };
  });

  app.factory("editBookmark", function(state) {
    return function(bookmark) {
      state.formBookmark.bookmark = bookmark;
    };
  });

  app.controller("BookmarkFormController", function ($scope, state, bookmarks, saveBookmark) {
    $scope.formBookmark = state.formBookmark;
    $scope.saveBookmark = saveBookmark;
    $scope.clearForm = state.clearForm;
  });

})(
  angular.module("App_base", ["ngResource"])
);
