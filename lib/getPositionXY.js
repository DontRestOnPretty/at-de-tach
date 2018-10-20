"use strict"; // create enumeration object for repeated class names

var CLASSES = {
  marker: "input__marker",
  visible: "input__marker--visible"
};

var createMarker = function createMarker(content, modifier) {
  // create a marker for the input
  var marker = document.createElement("div");
  marker.classList.add(CLASSES.marker, "".concat(CLASSES.marker, "--").concat(modifier));
  marker.textContent = content;
  return marker;
};
/**
 * returns x, y coordinates for absolute positioning of a span within a given text input
 * at a given selection point
 * @param {object} input - the input element to obtain coordinates for
 * @param {number} selectionPoint - the selection point for the input
 */


var getCursorXY = function getCursorXY(input, selectionPoint) {
  var inputX = input.offsetLeft,
      inputY = input.offsetTop; // create a dummy element that will be a clone of our input

  var div = document.createElement("div"); // get the computed style of the input and clone it onto the dummy element

  var copyStyle = getComputedStyle(input);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = copyStyle[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;
      div.style[prop] = copyStyle[prop];
    } // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>

  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var swap = ".";
  var inputValue = input.tagName === "INPUT" ? input.value.replace(/ /g, swap) : input.value; // set the div content to that of the textarea up until selection

  var textContent = inputValue.substr(0, selectionPoint); // set the text content of the dummy element div

  div.textContent = textContent;
  if (input.tagName === "TEXTAREA") div.style.height = "auto"; // if a single line input then the div needs to be single line and not break out like a text area

  if (input.tagName === "INPUT") div.style.width = "auto"; // create a marker element to obtain caret position

  var span = document.createElement("span"); // give the span the textContent of remaining content so that the recreated dummy element is as close as possible

  span.textContent = inputValue.substr(selectionPoint) || "."; // append the span marker to the div

  div.appendChild(span); // append the dummy element to the body

  document.body.appendChild(div); // get the marker position, this is the caret position top and left relative to the input

  var spanX = span.offsetLeft,
      spanY = span.offsetTop; // lastly, remove that dummy element
  // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered

  document.body.removeChild(div); // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input

  return {
    x: inputX + spanX,
    y: inputY + spanY
  };
};
/**
 * shows a position marker that highlights where the caret is
 * @param {object} e - the input or click event that has been fired
 */


var showPositionMarker = function showPositionMarker(e) {
  // grab the input element
  var input = e.currentTarget; // create a function that will handle clicking off of the input and hide the marker

  var processClick = function processClick(evt) {
    if (e !== evt && evt.target !== e.target) {
      toggleMarker();
    }
  }; // create a function that will toggle the showing of the marker


  var toggleMarker = function toggleMarker() {
    input.__IS_SHOWING_MARKER = !input.__IS_SHOWING_MARKER;

    if (input.__IS_SHOWING_MARKER && !input.__MARKER) {
      // assign a created marker to input
      input.__MARKER = createMarker("Here I am!", "position"); // append it to the body

      document.body.appendChild(input.__MARKER);
      document.addEventListener("click", processClick);
    } else {
      document.body.removeChild(input.__MARKER);
      document.removeEventListener("click", processClick);
      input.__MARKER = null;
    }
  }; // if the marker isn't showing, show it


  if (!input.__IS_SHOWING_MARKER) toggleMarker(); // if the marker is showing, update its position

  if (input.__IS_SHOWING_MARKER) {
    // grab the properties from the input that we are interested in
    var offsetLeft = input.offsetLeft,
        offsetTop = input.offsetTop,
        offsetHeight = input.offsetHeight,
        offsetWidth = input.offsetWidth,
        scrollLeft = input.scrollLeft,
        scrollTop = input.scrollTop,
        selectionEnd = input.selectionEnd; // get style property values that we are interested in

    var _getComputedStyle = getComputedStyle(input),
        lineHeight = _getComputedStyle.lineHeight,
        paddingRight = _getComputedStyle.paddingRight; // get the caret X and Y from our helper function


    var _getCursorXY = getCursorXY(input, selectionEnd),
        x = _getCursorXY.x,
        y = _getCursorXY.y; // set the marker positioning
    // for the left positioning we ensure that the maximum left position is the width of the input minus the right padding using Math.min
    // we also account for current scroll position of the input


    var newLeft = Math.min(x - scrollLeft, offsetLeft + offsetWidth - parseInt(paddingRight, 10)); // for the top positioning we ensure that the maximum top position is the height of the input minus line height
    // we also account for current scroll position of the input

    var newTop = Math.min(y - scrollTop, offsetTop + offsetHeight - parseInt(lineHeight, 10));

    input.__MARKER.setAttribute("style", "left: ".concat(newLeft, "px; top: ").concat(newTop, "px;"));
  }
};
/**
 * shows a position marker for where a user has selected input content
 * @param {object} e - mouseup event for text selection
 */


var getSelectionArea = function getSelectionArea(e) {
  // grab the input element
  var input = e.currentTarget; // grab the properties of the input we are interested in

  var offsetLeft = input.offsetLeft,
      offsetWidth = input.offsetWidth,
      scrollLeft = input.scrollLeft,
      scrollTop = input.scrollTop,
      selectionStart = input.selectionStart,
      selectionEnd = input.selectionEnd; // grab styling properties we are interested in

  var _getComputedStyle2 = getComputedStyle(input),
      paddingRight = _getComputedStyle2.paddingRight; // create a function that will handle clicking off of the input and hide the marker


  var processClick = function processClick(evt) {
    if (e !== evt && evt.target !== e.target) {
      toggleMarker();
    }
  }; // create a function that will toggle the showing of the marker


  var toggleMarker = function toggleMarker() {
    input.__IS_SHOWING_MARKER = !input.__IS_SHOWING_MARKER;

    if (input.__IS_SHOWING_MARKER && !input.__MARKER) {
      // assign a created marker to input
      input.__MARKER = createMarker("Here's your selection! 🎉", "selection"); // append it to the body

      document.body.appendChild(input.__MARKER);
      document.addEventListener("click", processClick);
    } else {
      document.body.removeChild(input.__MARKER);
      document.removeEventListener("click", processClick);
      input.__MARKER = null;
    }
  }; // if selectionStart === selectionEnd then there is no actual selection, hide the marker and return


  if (selectionStart === selectionEnd) {
    if (input.__IS_SHOWING_MARKER) toggleMarker();
    return;
  } // we need to get the start and end positions so we can work out a midpoint to show our marker
  // first, get the starting top and left using selectionStart


  var _getCursorXY2 = getCursorXY(input, selectionStart),
      startTop = _getCursorXY2.y,
      startLeft = _getCursorXY2.x; // then get the ending top and left using selectionEnd


  var _getCursorXY3 = getCursorXY(input, selectionEnd),
      endTop = _getCursorXY3.y,
      endLeft = _getCursorXY3.x; // if the marker isn't showing and there's a selection, show the marker


  if (!input.__IS_SHOWING_MARKER && selectionStart !== selectionEnd) {
    toggleMarker();
  } // if the marker is showing then update its position


  if (input.__IS_SHOWING_MARKER) {
    // we don't care about the value of endTop as our marker will always show at the top point and this will always be startTop
    // account for scroll position by negating scrollTop
    // as for left positioning, we need to first work out if the end point is on the same line or we have multiline selection
    // in the latter case, the endpoint will be the furthest possible right selection point
    var endPoint = startTop !== endTop ? offsetLeft + (offsetWidth - parseInt(paddingRight, 10)) : endLeft; // we want the marker to show above the selection and in the middle of the selection so start point plus halve the endpoint minus the start point

    var newLeft = startLeft + (endPoint - startLeft) / 2; // set the marker positioning

    input.__MARKER.setAttribute("style", "left: ".concat(newLeft - scrollLeft, "px; top: ").concat(startTop - scrollTop, "px;"));
  }
};
/**
 * shows a custom UI based on whether a user has typed a certain character, in this case #(keycode 35 on keypress event)
 * for this demo, just allow user to select from a predetermined list of animals
 * @param {object} e - event fired for keypress, keydown or keyup
 */


var showCustomUI = function showCustomUI(e) {
  // grab properties of event we are interested in
  var input = e.currentTarget,
      which = e.which,
      type = e.type; // grab properties of input that we are interested in

  var offsetHeight = input.offsetHeight,
      offsetLeft = input.offsetLeft,
      offsetTop = input.offsetTop,
      offsetWidth = input.offsetWidth,
      scrollLeft = input.scrollLeft,
      scrollTop = input.scrollTop,
      selectionStart = input.selectionStart,
      value = input.value;

  var _getComputedStyle3 = getComputedStyle(input),
      paddingRight = _getComputedStyle3.paddingRight,
      lineHeight = _getComputedStyle3.lineHeight; // create a function that will handle clicking off of the input and hide the marker


  var processClick = function processClick(evt) {
    if (e !== evt && evt.target !== e.target) {
      toggleCustomUI();
    }
  };
  /**
   * toggles selected item in list via arrow keys
   * create a new selected item if one doesn't exist
   * else update the selected item based on the given selection direction
   * @param {string} dir - defines which element sibling to select next
   */


  var toggleItem = function toggleItem() {
    var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "next";

    var list = input.__CUSTOM_UI.querySelector("ul");

    if (!input.__SELECTED_ITEM) {
      input.__SELECTED_ITEM = input.__CUSTOM_UI.querySelector("li");

      input.__SELECTED_ITEM.classList.add("custom-suggestions--active");
    } else {
      input.__SELECTED_ITEM.classList.remove("custom-suggestions--active");

      var nextActive = input.__SELECTED_ITEM["".concat(dir, "ElementSibling")];

      if (!nextActive && dir === "next") nextActive = list.firstChild;else if (!nextActive) nextActive = list.lastChild;
      input.__SELECTED_ITEM = nextActive;
      nextActive.classList.add("custom-suggestions--active");
    }
  };
  /**
   * filter a dummy list of data and append a <ul> to the marker element to show to the end user
   */


  var filterList = function filterList() {
    var filter = value.slice(input.__EDIT_START + 1, selectionStart).toLowerCase();
    var suggestions = ["Cat 😺", "Dog 🐶", "Rabbit 🐰"];
    var filteredSuggestions = suggestions.filter(function (entry) {
      return entry.toLowerCase().includes(filter);
    });
    if (!filteredSuggestions.length) filteredSuggestions.push("No suggestions available...");
    var suggestedList = document.createElement("ul");
    suggestedList.classList.add("custom-suggestions");
    filteredSuggestions.forEach(function (entry) {
      var entryItem = document.createElement("li");
      entryItem.textContent = entry;
      suggestedList.appendChild(entryItem);
    });
    if (input.__CUSTOM_UI.firstChild) input.__CUSTOM_UI.replaceChild(suggestedList, input.__CUSTOM_UI.firstChild);else input.__CUSTOM_UI.appendChild(suggestedList);
  };
  /**
   * given a selected value, replace the special character and insert selected value
   * @param {string} selected - the selected value to be inserted into inputs text content
   * @param {bool} click - defines whether the event was a click or not
   */


  var selectItem = function selectItem(selected) {
    var click = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var start = input.value.slice(0, input.__EDIT_START);
    var end = input.value.slice(click ? selectionStart + 1 : selectionStart, input.value.length);
    input.value = "".concat(start).concat(selected).concat(end);
  };
  /**
   * handle when the suggestions list is clicked so that user can select from list
   * @param {event} e - click event on marker element
   */


  var clickItem = function clickItem(e) {
    e.preventDefault();

    if (e.target.tagName === "LI") {
      input.focus();
      toggleCustomUI();
      selectItem(e.target.textContent, true);
    }
  }; // toggle custom UI on and off


  var toggleCustomUI = function toggleCustomUI() {
    input.__EDIT_START = selectionStart;
    input.__IS_SHOWING_CUSTOM_UI = !input.__IS_SHOWING_CUSTOM_UI;

    if (input.__IS_SHOWING_CUSTOM_UI && !input.__CUSTOM_UI) {
      // assign a created marker to input
      input.__CUSTOM_UI = createMarker(null, "custom"); // append it to the body

      document.body.appendChild(input.__CUSTOM_UI);

      input.__CUSTOM_UI.addEventListener("click", clickItem);

      document.addEventListener("click", processClick);
    } else {
      input.__CUSTOM_UI.removeEventListener("click", clickItem);

      document.body.removeChild(input.__CUSTOM_UI);
      document.removeEventListener("click", processClick);
      input.__CUSTOM_UI = null;
    }

    if (input.__IS_SHOWING_CUSTOM_UI) {
      // update list to show
      filterList(); // update position

      var _getCursorXY4 = getCursorXY(input, selectionStart),
          x = _getCursorXY4.x,
          y = _getCursorXY4.y;

      var newLeft = Math.min(x - scrollLeft, offsetLeft + offsetWidth - parseInt(paddingRight, 10));
      var newTop = Math.min(y - scrollTop, offsetTop + offsetHeight - parseInt(lineHeight, 10));

      input.__CUSTOM_UI.setAttribute("style", "left: ".concat(newLeft, "px; top: ").concat(newTop, "px;"));
    }
  };

  var previousChar = value.charAt(selectionStart - 1).trim(); // determine whether we can show custom UI, format must be special character preceded by a space

  if (which === 35 && previousChar === "") {
    toggleCustomUI();
  } else if (input.__IS_SHOWING_CUSTOM_UI) {
    switch (which) {
      case 35:
      case 32:
        toggleCustomUI();
        break;

      case 8:
        if (selectionStart === input.__EDIT_START) toggleCustomUI();else filterList();
        break;

      case 13:
        if (input.__SELECTED_ITEM) {
          e.preventDefault();
          selectItem(input.__CUSTOM_UI.querySelector(".custom-suggestions--active").textContent);
          toggleCustomUI();
        } else {
          toggleCustomUI();
        }

        break;

      case 38:
      case 40:
        if (type === "keydown") {
          e.preventDefault(); // up is 38

          toggleItem(which === 38 ? "previous" : "next"); // down is 40
        }

        break;

      case 37:
      case 39:
        if (selectionStart < input.__EDIT_START + 1) toggleCustomUI();
        break;

      default:
        filterList();
        break;
    }
  }
};