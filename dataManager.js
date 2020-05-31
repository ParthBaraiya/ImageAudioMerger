var file_type = "image"; // Stores the type of the uploaded file.
var upload_data = {
  image: "",
  audio: "",
};

// This Function Handles Drag and Drop uploads.
function DragAndDropUpload(ev, type, obj) {
  // Prevent default functions
  ev.preventDefault();
  file_type = type;

  // console.log(file_type);

  // Checks browser support
  var transferObj = ev.dataTransfer.items
    ? ev.dataTransfer.items
    : ev.dataTransfer.files;

  // Runs if User uploads only one file
  if (transferObj.length == 1) {
    // Get file
    var file = transferObj[0].getAsFile();

    SaveAndUploadFile(file, obj);
  } else {
    alert("Please Upload One File at once.");
  }
}

// This Function Handles OpenFile Dialoug.
function OpenFileUpload(event, type, elm) {
  // Set file type
  file_type = type;

  // Create input element having type = file
  var obj = document.createElement("input");
  obj.type = "file";

  // Check if event is supported or not
  if (document.createEvent) {
    // Create a new mouse event
    var evt = document.createEvent("MouseEvent");

    // Initialize click event
    evt.initEvent("click", true, false);

    // Trigger event
    obj.dispatchEvent(evt);

    // Attach oninput event to obj
    // So when we select the file from dialoug we can fetch selected file
    obj.addEventListener("input", function (value) {
      console.log(this.value);
      if (this.files.length == 1) {
        SaveAndUploadFile(this.files[0], elm);
      } else {
        alert("Please choose only one file at once.");
      }
      obj = null;
    });
  } else {
    alert("Your Brwser is not supported.");
  }
}

// Saves file in formdata object and upload it on server

// FormData Structure
//
//  formdata = {
//    type: image/audio,
//    file: file,
//  }
function SaveAndUploadFile(file, obj) {
  // Initialize form data
  var frmData = new FormData();

  frmData.append("type", file_type);

  // Split file name into parts to get Extension
  var fileName = file.name.split(".");
  var ext = fileName[fileName.length - 1].toLowerCase();

  // Accepts only jpg/jpeg or aac format according to file_type
  if (
    (ext == "aac" && file_type == "audio") ||
    ((ext == "jpg" || ext == "jpeg") && file_type == "image")
  ) {
    // Append file to formdata
    frmData.append("file", file, file.name);
    obj.innerHTML = "(" + file.name + ")";

    // Send UserData To server
    sendData(frmData);
  } else {
    // Message to alert user for upload specified file.
    var msg = file_type == "image" ? "jpg" : "aac";
    alert("Please Upload " + msg + " file only.");
  }
}

// Handles Ondrag event
function dragOverHandler(event) {
  event.preventDefault();
}

// Send data to server using ajax
function sendData(frmData) {
  try {
    // Ajax object for sending files
    $.ajax({
      // Url to backend php file
      url: "./dataUpload.php",

      // type of sending data
      type: "post",

      // Data to send
      // Contains file and file_type
      data: frmData,
      contentType: false,
      processData: false,

      // Success callback function
      success: function (response) {
        console.log(response);
        if (isNaN(response)) {
          // console.log(frmData);
          upload_data[file_type] = frmData.get("file").name;
          console.log(upload_data);
          if (upload_data["image"] != "" && upload_data["audio"] != "") {
            AddAlert();
          }
        }
      },

      // Error callback function
      error: function (jqXHR, exception) {
        console.log("Can not send data.");
      },
    });
  } catch (er) {
    // If ajax is not supported
    alert("This browser is not supported.");
  }
}

function AddAlert() {
  var outer = document.createElement("div");
  outer.id = "merger-alert";
  var element =
    '<div id="merger-alert">' +
    '<div id="merge-dialoug">' +
    '<div id="merge-file-list">' +
    MergeFileItem(upload_data["image"]) +
    BreakLine() +
    MergeFileItem(upload_data["audio"]) +
    '<div id="output-status"></div>' +
    "</div>" +
    '<div id="merge-button-cont">' +
    '<button id="merge-button">Merge</button>' +
    "</div></div></div>";
  outer.innerHTML = element;
  document.body.appendChild(outer);

  document
    .getElementById("merge-button")
    .addEventListener("click", function () {
      document.getElementById("merge-file-list").innerHTML += MergeFileItem(
        "</br></br>Merging...."
      );
      $.ajax({
        type: "post",
        url: "./merge.php",
        success: function (response) {
          console.log(response);
          document.getElementById("output-status").innerHTML = MergeFileItem(
            "</br></br>Merged"
          );
          AddPlay(document.getElementById("merge-button-cont"), response);
        },
        error: function (jqXHR, exception) {
          alert("Something is wrong.");
        },
      });
    });
}

function AddPlay(parent, path) {
  parent.innerHTML += '<button id="play-button">Play/Download</button>';

  document.getElementById("play-button").addEventListener("click", function () {
    window.location = path;
  });
}

function MergeFileItem(title) {
  return '<span id="merge-file-item">' + title + "</span>";
}

function BreakLine() {
  return '<div style="margin-top: 5px; margin-bottom: 5px;height: 2px;background: linear-gradient(to right,rgba(45,45,45,0.6), rgba(45,45,45,0.6), rgba(45,45,45,0.6),rgba(45,45,45,0.6),rgba(45,45,45,0.6),rgba(45,45,45,0.5), rgba(45,45,45,0));"></div>';
}
