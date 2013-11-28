var Bookmark = can.Model.extend({
  findAll: "GET /bookmarks",
  create: "POST /bookmarks",
  update: "PUT /bookmarks/{id}",
  destroy: "DELETE /bookmarks/{id}",
  findOne: "GET /bookmarks/{id}"
}, {
});


Bookmark.findAll({}, function(bookmarks) {
});

Bookmark.findOne({id:42}, function(bookmark) {
});

getBookmark: function (el) {
  return el.closest("li").data("bookmark");
},
".delete click": function(el, evt) {
  this.getBookmark(el).destroy();
},

