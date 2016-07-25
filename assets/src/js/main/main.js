$(window).load(function() {
  var curve = $.bez([0.55, 0, .1, 1]);
});

$(document).ready(function() {
  var curve = $.bez([0.55, 0, .1, 1]);
  FastClick.attach(document.body);

  $(window).scroll(function() {
    onScroll();
  });

  $(window).resize(function() {
    onResize();
  });


  function onScroll() {
  }

  function onResize() {
  }

  onScroll();
  onResize();

});
