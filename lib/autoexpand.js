"use strict";

function makeExpandingArea(container) {
  if (window.opera && /Mac OS X/.test(navigator.appVersion)) {
    container.querySelector('pre').appendChild(document.createElement('br'));
  }

  var area = container.querySelector('textarea');
  var span = container.querySelector('span');

  if (area.addEventListener) {
    area.addEventListener('input', function () {
      span.textContent = area.value;
    }, false);
    span.textContent = area.value;
  } else if (area.attachEvent) {
    // IE8 compatibility
    area.attachEvent('onpropertychange', function () {
      span.innerText = area.value;
    });
    span.innerText = area.value;
  } // Enable extra CSS


  container.className += " active";
}