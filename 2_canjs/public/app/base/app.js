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

