var Example = can.Construct.extend({
  count: 1,

  increment: function () {
    this.count++;
  }
});

var example = new Example();
example.increment();  // example.count is 2

var Example = can.Construct.extend({
  init: function (count) {
    this.count = count;
  }
});

var example = new Example(42); // example.count is 42

var Parent = can.Construct.extend({
  init: function(count) {
    this.count = count;
  },
  increment: function () {
    this.count++;
  },
  read: function(prefix) {
    return prefix + " " + String(this.count);
  }
});

var Child = Prent({
  //Child inherits the init function
  //Override increase
  increase: function () {
    this.count += 10;
  },

  // Add new function
  decrese: function () {
    this.count--;
  },

  // Override read, but call parent's version
  read: function () {
    return this.super("Count is") + "!";
  }
});

var child = new Child(2);
child.increase();
child.decrease();
child.count; // returns 11
child.read();  // returns "Count is 11!"

var Example = can.Construct.extend({
  staticCount: 0,
}, {
  protoCount: 0
});

var example1 = new Example();
var example2 = new Example();

example1.constructor.staticCount = 2;
example1.protoCount = 2;

Example.staticCount; // return 2
example2.constructor.staticCount; // returns 2
example2.protoCount // return 0

var ExampleStatic = can.Construct.extend({
  staticCount: 4
}, {
});

// Create an observe
var observe = new can.Observe({});
observe.bind("title", function(evt, newTitle, oldTitle) {
  console.log("title: newTitle=", newTitle, "oldTitle=", oldTitle);
});

observe.attr("title", "First");
observe.attr("title", "Second");

// Only to read
observe.attr("title");

observe.bind("change", function(evt, attr, how, newValue, oldValue) {
  console.log("change: attr=", attr, "how=", how, "newValue=", newValue, "oldValue=", oldValue);
});

observe.attr("title", "Third");
observe.removeAttr("title");

var observe = new can.Observe.List([42,44,46]);
observe.bind("add", function(evt, newValues, index) {
  console.log("add: newValues=", newValues, "index=", index);
});
observe.bind("remove", function(evt, oldValues, index) {
  console.log("remove: oldValues=", oldValues, "index=", index);
});
observe.push(48);
observe.splice(1,2);


var MyControl = can.Control.extend({
  init: function (element, options) {
    var view = "/concepts/bookmarks";
    element.html(view, {bookmarks:options.bookmarks});
  },

  "button click": function (el, evt) {
    //...
  },

  ".item :checkbox change": function (el. evt) {
    //...
  },
});

var bookmarks = [];
var options = {bookmarks: bookmarks};
new MyControl("#bookmark_continer", options);
// The followings works well, too...
// var element = $("#bookmark_container");
// new MyControl(element, options);


