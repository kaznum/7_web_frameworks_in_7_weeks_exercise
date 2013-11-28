var bookmarks = [
  {url: "http://one.com", title:"One"},
  {url: "http://two.com", title:"Two"}
];

var viewModel = {bookmarks:bookmarks};
var element = $("#target");

element.html(can.view("/app/base/bookmark_list", viewModel));

// can.view is implicitly called
element.html("/app/base/bookmark_list", viewModel);

bookmarks[0].attr("title", "Uno");
bookmarks.push({url:"http://three.com", title: "Three"});

