(function (app) {
  app.controller("BookmarkListController", function ($scope, $routeParams, state, bookmarks, editBookmark, deleteBookmark) {
    $scope.bookmarks = bookmarks;
    $scope.bookmarkFilter = state.bookmarkFilter;
    state.bookmarkFilter.filterTag = $routeParams.tag;
    $scope.deleteBookmark = deleteBookmark;
    $scope.editBookmark = editBookmark;
  });

  app.controller("TagListController", function($scope, $routeParams, state, bookmarks, buildTagList) {
    $scope.bookmarks = bookmarks;
    state.bookmarkFilter.filterTag = $routeParams.tag;
    $scope.$watch("bookmarks", function(updatedBookmarks) {
      $scope.tags = buildTagList(updatedBookmarks);
    }, true); // true compares objects for equality rather than by reference
  });

  app.controller("TagFilterController", function($scope, $routeParams, state) {
    $scope.bookmarkFilter = state.bookmarkFilter;
    state.bookmarkFilter.filterTag = $routeParams.tag;
  });

  app.config(['$routeProvider', function ($routeProvider) {
    var params = {
      controller: "BookmarkListController",
      templateUrl: "/app/routing/bookmark_list.html"
    };
    $routeProvider.
      when("/", params).
      when("/filter/:tag", params);
  }]);
})(
  angular.module("App_routing", ["ngResource", "App_tagfilter", "ngRoute"])
);
