let database = firebase.database();
let reached = true;
let start_temp, start_hum;
let client_data_save = "ksksksk";
let sent = false;
let id, count;
let clicks = 0;
let rooms = ["Klassrummet",
             "Växthuset",
             "Pingisrummet",
             "Teknikrum",
             "Sistrum"];
let room = rooms[0];

window.onload = Load;

document.addEventListener('contextmenu', event => event.preventDefault());

function updateLiveValue(rum, values) {
  temperature = values[`rum${rum}`]["temp"];
  humidity = values[`rum${rum}`]["hum"];
 
  temperature = temperature.toFixed(2);
  humidity = humidity.toFixed(2);

  console.log("hejeh" + rooms.indexOf(room)+1);
 
  document.getElementById(`temp${rum}`).innerHTML = temperature + "C";
  document.getElementById(`hum${rum}`).innerHTML = humidity + "%";

  if(rum == rooms.indexOf(room, 0)+1) {
    document.getElementById('current-temp').innerHTML = temperature + "C";
    document.getElementById('current-hum').innerHTML = humidity + "%";
  }

}
 
database.ref("live/").on("value", snap => {
  for (let i = 1; i < 6; i++) {
    updateLiveValue(i, snap.val()); // change tha last parameter for decimals
  }
});

function Load() {
  newRoom();
  $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    console.log(data);
      client_data_save = data;
      console.log(client_data_save);
      let i = 0;
      let str = snapval["ids"];
      if(str == undefined) {
        str = "";
      }
      while(str.includes(i)) {
        i++;
      }
      id = i;
      console.log("id" + id);
      str += toString(id);
      database.ref("data/val/id/"+toString(id)).set({id: client_data_save });
  });
  
}

function increase(bubble) {
  let snd = new Audio("plop-effect.mp3")
  snd.play();
  clicks++;
  document.getElementById('click').innerHTML = "Bubble Clicks: " + clicks;
  room = rooms[bubble];
  newRoom();
}

function newRoom() {
  let title = document.getElementById("title");
  console.log(room);
  if(title.innerHTML == room) return;
  title.innerHTML = room;
}

window.addEventListener("load", pageFullyLoaded, true);

function pageFullyLoaded() {

window.addEventListener("scroll", (event) => {
  let scroll = this.scrollY;
  let bg = document.getElementById("bg");
  if(scroll > 150) {
    sent = true;
    document.getElementById("title").style.opacity = "1";
    document.getElementById("current-temp").style.opacity = "1";
    document.getElementById("current-hum").style.opacity = "1";
    document.getElementById("click").style.opacity = "1";
    if(scroll > 300) {
      let chart = document.getElementById("curve_chart");
      chart.style.opacity = "1";
      chart.style.transform = "translateX(30px)";
    }
    bg.style.filter = "blur(2px)";
  }else{

    bg.style.filter = "blur(0px)";
  }
  console.log(scroll);
});

setTimeout(function() {
  moveBubbles();
}, 20);

setInterval(function() {
    moveBubbles();

}, 2000);

function moveBubbles() {
  let objects = document.getElementsByClassName("con");
  for(var i=0; i<objects.length; i++) {
      let randomx = Math.random()*100;
      let randomy = Math.random()*100;
      objects[i].style.transform = "translate(" + randomx.toString() + "px, " + randomy.toString() + "px)";
  }
}

document.getElementById('check').onclick = function() {
  if(this.checked) {
    $("html").css('filter', 'invert(100%)');
  }else {
    $("html").css('filter', 'invert(0%)');
  }
};
  

}
