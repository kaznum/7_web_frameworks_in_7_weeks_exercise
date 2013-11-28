var RoutingControl = can.Control.extend({
  init: function() {
    $(window).trigger("hashchange");
  },
  "route": function() {
    this.options.filterObject.attr("filterTag", "");
  },
  "filter/:tag route": function(data) {
    this.options.filterObject.attr("filterTag", data.tag);
  }
});

var RoutingTagListControl = can.Control.extend({
  defaults: {
    view: "/app/routing/tag_list"
  }
}, {
  init: function (element, options) {
    this.eventHub = options.eventHub;
    var model = { bookmarks: options.bookmarks };
    element.html(options.view, model);
  }
});

var RoutingBookmarkListControl =  BookmarkListControl.extend({
  view: "/app/routing/bookmark_list"
});

var RoutingTagFilterControl = can.Control.extend({
  defaults: {
    view: "/app/routing/tag_filter"
  }
}, {
  init: function(element, options) {
    this.element.html(options.view, options.filterObject);
  }
});

var App_routing = can.Construct.extend({
  init: function() {
    TaggedBookmark.findAll({}, function(bookmarks) {
      var eventHub = new can.Observe({});
      var options = { eventHub: eventHub, bookmarks:bookmarks, filterObject: filterObject };

      var filtered = bookmarks.filter(filterFunction);

      // The options object with the filtered bookmark list
      var filteredOptions = can.extend({}, options, {bookmarks: filtered});

      new RoutingBookmarkListControl("#bookmark_list_container", filteredOptions);
      new RoutingTagFilterControl("#filter_container", options);
      new RoutingTagListControl("#tag_list_container", options);
      new TaggedBookmarkFormControl("#bookmark_form_container", options);
      new RoutingControl(document.body, options);
    });
  }
});
