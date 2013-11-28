var TaggedBookmark = ValidatingBookmark.extend({
  init: function () {
    var tagList = this.attr("tagList");
    if (tagList && tagList.length > 0) {
      this.attr("tagsAsString", tagList.join(", "));
    } else {
      this.attr("tagList", new can.Observe.List([]));
      this.attr("tagsAsString", "");
    }

    this.bind("tagsAsString", this.onTagsAsStringChange);
  },
  onTagsAsStringChange: function(evt, tagsAsString) {
    var trimmed = can.map(tagsAsString.split(","), can.trim);

    var byNotEmpty = function(tag) {
      return tag.length > 0;
    };
    var notEmpty = can.filter(trimmed, byNotEmpty);
    var tagList = this.attr("tagList");
    tagList.attr(notEmpty.sort(), true);
  }
});
TaggedBookmark.List = ValidatingBookmark.List.extend({
  tags: function () {
    var bookmarkCounts = {};

    this.each(function(bookmark) {
      var tagList = bookmark.attr("tagList");

      if(tagList) {
        tagList.each(function(tag) {
          var existing = bookmarkCounts[tag];
          bookmarkCounts[tag] = existing ? existing + 1 : 1;
        });
      }
    });

    var labels = Object.keys(bookmarkCounts);
    labels.sort();

    return can.map(labels, function(label) {
      return { label: label, bookmarkCount: bookmarkCounts[label] };
    });
  }
});
var TaggedBookmarkListControl = BookmarkListControl.extend({
  view: "/app/tagfilter/bookmark_list"
});

var TaggedBookmarkFormControl = ValidatingBookmarkFormControl.extend({
  BookmarkModel: TaggedBookmark,
  view: "/app/tagfilter/bookmark_form"
});

var filterObject = new can.Observe({
  filterTag: "" // initially blank
});

var filterFunction = function(bookmark) {
  var tagList = bookmark.attr("tagList");
  var filterTag = filterObject.attr("filterTag");
  var noFilter = (!filterTag) || (filterTag.length == 0);
  var tagListContainsFilterTag = tagList && tagList.indexOf(filterTag) > -1;
  return noFilter || tagListContainsFilterTag;
};


var TagFilterBookmarkListControl =  TaggedBookmarkListControl.extend({
  "a.tag click": function(el, evt) {
    var tag = String(el.data("tag"));
    this.options.filterObject.attr("filterTag", tag);
  }
});

var TagFilterControl = can.Control.extend({
  defaults: {
    view: "/app/tagfilter/tag_filter"
  }
}, {
  init: function(element, options) {
    this.element.html(options.view, options.filterObject);
  },
  "a.clear click": function(el, evt) {
    this.options.filterObject.attr("filterTag", "");
  }
});

var TagListControl = can.Control.extend({
  defaults: {
    view: "/app/tagfilter/tag_list"
  }
}, {
  init: function (element, options) {
    this.eventHub = options.eventHub;
    var model = { bookmarks: options.bookmarks };
    element.html(options.view, model);
  },
  "a.tag click": function(el, evt) {
    var tag = el.data("tag");
    this.options.filterObject.attr("filterTag", tag.label);
  }
});

var App_tagfilter = can.Construct.extend({
  init: function() {
    TaggedBookmark.findAll({}, function(bookmarks) {
      var eventHub = new can.Observe({});
      var options = { eventHub: eventHub, bookmarks:bookmarks, filterObject: filterObject };

      var filtered = bookmarks.filter(filterFunction);

      // The options object with the filtered bookmark list
      var filteredOptions = can.extend({}, options, {bookmarks: filtered});

      new TagFilterBookmarkListControl("#bookmark_list_container", filteredOptions);
      new TagFilterControl("#filter_container", options);
      new TagListControl("#tag_list_container", options);
      new TaggedBookmarkFormControl("#bookmark_form_container", options);
    });
  }
});

