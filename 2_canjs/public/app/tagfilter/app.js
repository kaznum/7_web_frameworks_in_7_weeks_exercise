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

var TaggedBookmarkListControl = BookmarkListControl.extend({
  view: "/app/tagfilter/bookmark_list"
});

var TaggedBookmarkFormControl = ValidatingBookmarkFormControl.extend({
  BookmarkModel: TaggedBookmark,
  view: "/app/tagfilter/bookmark_form"
});

var App_base = can.Construct.extend({
  init: function() {
    ValidatingBookmark.findAll({}, function(bookmarks) {
      var eventHub = new can.Observe({});
      var options = {eventHub: eventHub, bookmarks: bookmarks};

      new TaggedBookmarkListControl("#bookmark_list_container", options);
      new TaggedBookmarkFormControl("#bookmark_form_container", options);
    });
  }
});


