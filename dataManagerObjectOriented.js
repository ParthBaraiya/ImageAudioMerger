function Uploader(imageObj, audioObj) {
  this.imageObj = imageObj;
  this.audioObj = audioObj;
  let upload_data = {
    image: "",
    audio: "",
  };
  let file_type = "";

  let DragAndDropUpload = function (transferObj, obj) {
    // Runs if User uploads only one file
    if (transferObj.length == 1) {
      // Get file
      let file = transferObj[0].getAsFile();

      SaveAndUploadFile(file, obj);
    } else {
      alert("Please Upload One File at once.");
    }
  };

  let OpenFileUpload = function (elm) {
    // Create input element having type = file
    let obj = document.createElement("input");
    obj.type = "file";

    // Check if event is supported or not
    if (document.createEvent) {
      // Create a new mouse event
      let evt = document.createEvent("MouseEvent");

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
  };

  this.imageObj.addEventListener("click", function (ev) {
    file_type = "image";
    OpenFileUpload(this);
  });

  this.imageObj.addEventListener("dragover", function (ev) {
    ev.preventDefault();
  });

  this.imageObj.addEventListener("drop", function (ev) {
    ev.preventDefault();
    file_type = "image";
    let transferObj = ev.dataTransfer.items
      ? ev.dataTransfer.items
      : ev.dataTransfer.files;
    DragAndDropUpload(transferObj, this);
  });

  this.audioObj.addEventListener("click", function (ev) {
    file_type = "audio";
    OpenFileUpload(this);
  });

  this.audioObj.addEventListener("dragover", function (ev) {
    ev.preventDefault();
  });

  this.audioObj.addEventListener("drop", function (ev) {
    ev.preventDefault();
    file_type = "audio";
    let transferObj = ev.dataTransfer.items
      ? ev.dataTransfer.items
      : ev.dataTransfer.files;
    DragAndDropUpload(transferObj, this);
  });

  let SendData = function (frmData) {
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
  };

  let AddAlert = function () {
    let outer = document.createElement("div");
    outer.id = "merger-alert";
    let element =
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
        document.getElementById("output-status").innerHTML = MergeFileItem(
          "</br></br>Merging...."
        );
        $.ajax({
          type: "post",
          url: "./merge.php",
          success: function (response) {
            console.log(response);
            document.getElementById("output-status").innerHTML = MergeFileItem(
              "</br></br>Merged."
            );
            AddPlay(document.getElementById("merge-button-cont"), response);
          },
          error: function (jqXHR, exception) {
            alert("Something is wrong.");
          },
        });
      });
  };

  let MergeFileItem = function (title) {
    return '<span id="merge-file-item">' + title + "</span>";
  };

  let SaveAndUploadFile = function (file, obj) {
    // Initialize form data
    let frmData = new FormData();

    frmData.append("type", file_type);

    // Split file name into parts to get Extension
    let fileName = file.name.split(".");
    let ext = fileName[fileName.length - 1].toLowerCase();

    // Accepts only jpg/jpeg or aac format according to file_type
    if (
      (ext == "aac" && file_type == "audio") ||
      ((ext == "jpg" || ext == "jpeg") && file_type == "image")
    ) {
      // Append file to formdata
      frmData.append("file", file, file.name);
      obj.innerHTML = "(" + file.name + ")";

      // Send UserData To server
      SendData(frmData);
    } else {
      // Message to alert user for upload specified file.
      let msg = file_type == "image" ? "jpg" : "aac";
      alert("Please Upload " + msg + " file only.");
    }
  };

  let AddPlay = function (parent, path) {
    parent.innerHTML += '<button id="play-button">Play/Download</button>';

    document
      .getElementById("play-button")
      .addEventListener("click", function () {
        window.location = path;
      });
  };

  let BreakLine = function () {
    return '<div style="margin-top: 5px; margin-bottom: 5px;height: 2px;background: linear-gradient(to right,rgba(45,45,45,0.6), rgba(45,45,45,0.6), rgba(45,45,45,0.6),rgba(45,45,45,0.6),rgba(45,45,45,0.6),rgba(45,45,45,0.5), rgba(45,45,45,0));"></div>';
  };
}
