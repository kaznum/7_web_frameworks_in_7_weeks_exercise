var Bookmark = can.Model.extend({
  findAll: "GET /bookmarks",
  create: "POST /bookmarks",
  update: "PUT /bookmarks/{id}",
  destroy: "DELETE /bookmarks/{id}",
  findOne: "GET /bookmarks/{id}"
}, {
});

var ValidatingBookmark = Bookmark.extend({
  init: function() {
    var urlPattern = new RegExp(
      "(http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?" +
        "(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?");

    this.validatePresenceOf(["url", "title"]);
    this.validateFormatOf("url", urlPattern);
  }
}, {
});

var BookmarkListControl = can.Control.extend({
  view: "/app/base/bookmark_list",

  init: function(element, options) {
    this.eventHub = options.eventHub;
    var view = options.view || this.view;
    element.html(view, this.getViewModel(options));
  },
  getViewModel: function (options) {
    return {bookmarks: options.bookmarks}
  },
  getBookmark: function (el) {
    return el.closest("li").data("bookmark");
  },
  ".delete click": function(el, evt) {
    this.getBookmark(el).destroy();
  },
  ".edit click": function(el, evt) {
    can.trigger(this.eventHub, "editBookmark", this.getBookmark(el));
  }
});

var BookmarkFormControl = can.Control.extend({
  BookmarkModel: Bookmark,
  view: "/app/base/bookmark_form",
  init: function (element, options) {
    this.BookmarkModel.bind("created", function(evt, bookmark) {
      options.bookmarks.push(bookmark);
    });
    this.clearForm();
  },
  editBookmark: function(bookmark) {
    var view = this.options.view || this.view;
    this.element.html(view, bookmark);
    bookmark.bind("destroyed", this.clearForm.bind(this));
  },
  clearForm: function () {
    this.editBookmark(new this.BookmarkModel());
  },
  "{eventHub} editBookmark": function(eventHub, evt, bookmark) {
    this.editBookmark(bookmark);
  },
  ".save click": function(el, evt) {
    evt.preventDefault();
    var bookmark = el.data("bookmark");
    bookmark.attr(can.deparam(el.closest("form").serialize()));
    this.saveBookmark(bookmark);
  },
  saveBookmark: function(bookmark) {
    bookmark.save(this.clearForm.bind(this), this.signalError);
  },
  signalError: function() {
    alert("The input is not valid.");
  },
  ".clear click": function (el, evt) {
    evt.preventDefault();
    this.clearForm();
  }
});

var ValidatingBookmarkFormControl = BookmarkFormControl.extend({
  BookmarkModel: ValidatingBookmark,

  editBookmark: function(bookmark) {
    this._super(bookmark);

    var self = this;
    bookmark.bind("change", function () {
      var errorMessage = bookmark.errors() ? can.map(bookmark.errors(),
                                                     function(message, attrName) {
                                                       return attrName + " " + message + ". ";
                                                     }).join("") : "";
      self.element.find(".text-error").html(errorMessage);
    });
  },

  saveBookmark: function (bookmark) {
    if (!bookmark.errors()) {
      this._super(bookmark);
    }
  }
});

var App_base = can.Construct.extend({
  init: function() {
    ValidatingBookmark.findAll({}, function(bookmarks) {
      var eventHub = new can.Observe({});
      var options = {eventHub: eventHub, bookmarks: bookmarks};

      new BookmarkListControl("#bookmark_list_container", options);
      new ValidatingBookmarkFormControl("#bookmark_form_container", options);
    });
  }
});


