(function (app) {
  app.service("state", function(Bookmark) {
    this.formBookmark = {bookmark: new Bookmark()};
    this.clearForm = function () {
      this.formBookmark.bookmark = new Bookmark();
    };
    this.bookmarkFilter = {filterTag: ""};
  });

  app.factory("buildTagList", function () {
    return function(bookmarks) {
      var bookmarkCounts = {};

      bookmarks.each(function(bookmark) {
        var tagList = bookmark.tagList;
        tagList.each(function(tag) {
          var existing = bookmarkCounts[tag];
          bookmarkCounts[tag] = existing ? existing + 1 : 1;
        });
      });

      var labels = Object.keys(bookmarkCounts);
      labels.sort();

      return labels.map(function(label) {
        return { label: label, bookmarkCount: bookmarkCounts[label]};
      });
    };
  });

  app.controller("TagListController", function($scope, state, bookmarks, buildTagList) {
    $scope.bookmarks = bookmarks;

    $scope.$watch("bookmarks", function(updatedBookmarks) {
      $scope.tags = buildTagList(updatedBookmarks);
    }, true); // true compares objects for equality rather than by reference

    $scope.filterBy = function (tag) {
      state.bookmarkFilter.filterTag = tag.label;
    };
  });

  app.filter("filterByTag", function () {
    var byTag = function(filterTag) {
      return function (bookmark) {
        var tagList = bookmark.tagList;
        var noFilter = (!filterTag) || (filterTag.length == 0);
        var tagListContainsFilterTag = tagList && tagList.indexOf(filterTag) > -1;

        return noFilter || tagListContainsFilterTag;
      };
    };
    return function(bookmarks, filterTag) {
      return bookmarks.filter(byTag(filterTag));
    };
  });


  app.controller("BookmarkListController", function ($scope, state, bookmarks, deleteBookmark, editBookmark) {
    $scope.bookmarks = bookmarks;
    $scope.bookmarkFilter = state.bookmarkFilter;
    $scope.filterBy = function(tag) { state.bookmarkFilter.filterTag = tag; };
    $scope.deleteBookmark = deleteBookmark;
    $scope.editBookmark = editBookmark;
  });

  app.controller("TagFilterController", function($scope, state) {
    $scope.bookmarkFilter = state.bookmarkFilter;
    $scope.clearFilter = function () {
      state.bookmarkFilter.filterTag = "";
    };
  });
})(
  angular.module("App_tagfilter", ["ngResource", "App_base"])
);

