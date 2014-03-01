var test = require('tape');

test('basic', function(t){
  var test_styles = document.querySelector('div').style;
  t.equal(test_styles.cssText, '-webkit-transform: translateX(0px); opacity: 1; -webkit-transition-property: all; -webkit-transition-duration: 1.33s; -webkit-transition-timing-function: ease-in-out; -webkit-transition-delay: 0s; -webkit-perspective: 1000; -webkit-backface-visibility: hidden; ');
  t.end();
});
