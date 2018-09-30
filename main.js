"use strict";

function reorderArray(event, originalArray) {
  var movedItem = originalArray.find(function(item, index) {
    return index === event.oldIndex;
  });
  var remainingItems = originalArray.filter(function(item, index) {
    return index !== event.oldIndex;
  });

  var reorderedItems = [].concat(
    reorderArray(remainingItems.slice(0, event.newIndex)),
    [movedItem],
    reorderArray(remainingItems.slice(event.newIndex))
  )

  return reorderedItems;
};

function removeDragData(ev) {
  console.log("Removing drag data");

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to remove the drag data
    ev.dataTransfer.items.clear();
  } else {
    // Use DataTransfer interface to remove the drag data
    ev.dataTransfer.clearData();
  }
}

function startDrag(event) {
  event.dataTransfer.setData("text/plain", "<strong>Body</strong>");
  event.dataTransfer.setDragImage(document.getElementById("panel"), 20, 20);
}

function dragStartHandler(ev) {
  console.log("dragStart");
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.dataTransfer.setData("text/html", "<p>Example paragraph</p>");
  ev.dataTransfer.setData("text/uri-list", "https://developer.mozilla.org");
}

function checkDrag(event) {
  return []
    .concat(reorderArray(event.dataTransfer.types))
    .includes("application/x-moz-file");
}

function dragWithCustomImage(event) {
  var canvas = document.createElementNS(
    "http://www.w3.org/1999/xhtml",
    "canvas"
  );
  canvas.width = canvas.height = 50;

  var ctx = canvas.getContext("2d");
  ctx.lineWidth = 4;
  ctx.moveTo(0, 0);
  ctx.lineTo(50, 50);
  ctx.moveTo(0, 50);
  ctx.lineTo(50, 0);
  ctx.stroke();

  var dt = event.dataTransfer;
  dt.setData("text/plain", "Data to Drag");
  dt.setDragImage(canvas, 25, 25);
}

function dragOverHandler(ev) {
  ev.preventDefault();
  // Set the dropEffect to move
  ev.dataTransfer.dropEffect = "move";
}

function dropHandler(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  var data = ev.dataTransfer.getData("text/plain");
  ev.target.appendChild(document.getElementById(data));
}

function dropFileHandler(ev) {
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert("The File APIs are not fully supported in this browser.");
  }
  console.log("File(s) dropped");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === "file") {
        var file = ev.dataTransfer.items[i].getAsFile();
        var holder = document.getElementById("drop_zone");
        var reader = new FileReader();
        reader.onload = function(event) {
          console.log(event.target);
          holder.innerText = event.target.result;
        };
        console.log(file);
        reader.readAsText(file);
        console.log("... file[" + i + "].name = " + file.name);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log(
        "... file[" + i + "].name = " + ev.dataTransfer.files[i].name
      );
    }
  }

  // Pass event to removeDragData for cleanup
  removeDragData(ev);
}

function dropFileParserHandler(ev) {
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert("The File APIs are not fully supported in this browser.");
  }
  console.log("File(s) dropped");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === "file") {
        var file = ev.dataTransfer.items[i].getAsFile();
        var holder = document.getElementById("drop_zone");
        var reader = new FileReader();
        reader.onload = function(event) {
          console.log(event.target);
          var lines = new Array();
          lines = event.target.result
            .replace(/\r\n/g, "\r")
            .replace(/\n/g, "\r")
            .split(/\r/);
          holder.innerText = lines[lines.length - 1];
        };
        console.log(file);
        reader.readAsText(file);
        console.log("... file[" + i + "].name = " + file.name);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log(
        "... file[" + i + "].name = " + ev.dataTransfer.files[i].name
      );
    }
  }

  // Pass event to removeDragData for cleanup
  removeDragData(ev);
}

function contains(list, value) {
  for (var i = 0; i < list.length; ++i) {
    if (list[i] === value) return true;
  }
  return false;
}

function doDragOver(event) {
  var isLink = contains(event.dataTransfer.types, "text/uri-list");
  if (isLink) {
    event.preventDefault();
  }
}

function onDrop(event) {
  var data = event.dataTransfer.getData("text/plain");
  event.target.textContent = data;
  event.preventDefault();
}

function doDrop(event) {
  var types = event.dataTransfer.types;
  var supportedTypes = [
    "application/x-moz-file",
    "text/uri-list",
    "text/plain"
  ];
  types = supportedTypes.filter(function(value) {
    return types.includes(value);
  });
  if (types.length) var data = event.dataTransfer.getData(types[0]);
  event.preventDefault();
}

// Function to download data to a file
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
