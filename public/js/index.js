// let person = prompt("Please enter your name", "");
const userStatus = {
  microphone: true,
  mute: false,
  username: "user#" + Math.floor(Math.random() * 999999),
  // username: person,
  online: false,
};

const usernameInput = document.getElementById("username");
const usernameLabel = document.getElementById("username-label");
const usernameDiv = document.getElementById("username-div");
const usersDiv = document.getElementById("users");

usernameInput.value = userStatus.username;
usernameLabel.innerText = userStatus.username;


window.onload = (e) => {
  mainFunction(1000);
  if(window.location.href === 'https://voicecallingapp.herokuapp.com/?onlineStatus=true' ){
    userStatus.online = true
  }
};

var socket = io("ws:https://voicecallingapp.herokuapp.com/");
// var socket = io("ws:localhost:3000/");
socket.emit("userInformation", userStatus);
 


function mainFunction(time) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    
    var madiaRecorder = new MediaRecorder(stream);
    madiaRecorder.start();
    var audioChunks = [];

    madiaRecorder.addEventListener("dataavailable", function (event) {
      audioChunks.push(event.data);
    });
    console.log("audio chunk == ", audioChunks)
    madiaRecorder.addEventListener("stop", function () {
      var audioBlob = new Blob(audioChunks);

      audioChunks = [];

      var fileReader = new FileReader();
      fileReader.readAsDataURL(audioBlob);
      fileReader.onloadend = function () {
        if (!userStatus.microphone || !userStatus.online) return;

        var base64String = fileReader.result;
        socket.emit("voice", base64String);

      };

      madiaRecorder.start();

      setTimeout(function () {
        madiaRecorder.stop();
      }, time);
    });

    setTimeout(function () {
      madiaRecorder.stop();
    }, time);
  });


  socket.on("send", function (data) {
    var audio = new Audio(data);
    audio.play();
  });

  // socket.on("usersUpdate", function (data) {
  //   usersDiv.innerHTML = '';
  //   for (const key in data) {
  //     if (!Object.hasOwnProperty.call(data, key)) continue;
  //     const element = data[key];
  //     const li = document.createElement("li");
  //     li.innerText = element.username;
  //     usersDiv.append(li);

  //   }
  // });
}

usernameLabel.onclick = function () {
  usernameDiv.style.display = "block";
  usernameLabel.style.display = "none";
}

// function changeUsername() {
//   userStatus.username = usernameInput.value;
//   usernameLabel.innerText = userStatus.username;
//   usernameDiv.style.display = "none";
//   usernameLabel.style.display = "block";
//   emitUserInformation();
// }

function toggleConnection(e) {
  // userStatus.online = !userStatus.online;
  console.log("eeee",e)
  if(!userStatus.online){
    userStatus.online = !userStatus.online;
    window.open('https://voicecallingapp.herokuapp.com/?onlineStatus=true','_blanck');
    // window.open('http://localhost:3000/?onlineStatus=true','_blanck');
  }

  editButtonClass(e, userStatus.online);
  emitUserInformation();
}

function toggleMute(e) {
  userStatus.mute = !userStatus.mute;

  editButtonClass(e, userStatus.mute);
  emitUserInformation();
}

function toggleMicrophone(e) {
  userStatus.microphone = !userStatus.microphone;
  editButtonClass(e, userStatus.microphone);
  emitUserInformation();
}


function editButtonClass(target, bool) {
  console.log("pppp",window.location.search)
  console.log("bool ==========>",bool)             //return true or false
  const classList = target.classList;
  classList.remove("enable-btn");
  classList.remove("disable-btn");
  
  if (bool)
  return classList.add("enable-btn");
  classList.add("disable-btn");
}

function emitUserInformation() {
  socket.emit("userInformation", userStatus);
}
