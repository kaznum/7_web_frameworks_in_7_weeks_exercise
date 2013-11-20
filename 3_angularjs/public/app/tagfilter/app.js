(function (app) {
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
  });

})(
  angular.module("App_tagfilter", ["ngResource", "App_base"])
);

