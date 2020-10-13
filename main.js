let database = firebase.database();
let reached = true;
let start_temp, start_hum;
let count = 0;
let client_data_save = "ksksksk";
let sent = false;
let id;
let clicks = 0;

window.onload = Load;

document.addEventListener('contextmenu', event => event.preventDefault());

database.ref("live/rum1").on("value", snap => {//checks if value paramater changes in the database reference and takes a data snapshot of set value
  snapval = snap.val();//extracts the contents of the snapshot as a JS object
  
  temperature = snapval["temp"];//sets temp to the value in temperature in the snapval object
  console.log(temperature);
  humidity = snapval["hum"];// sets humitity to the value in humitity in the snapval object


  if(reached) {
    document.getElementById("temp").innerHTML = `Temperature: ${temperature.toFixed(2)}℃`;//toFixed method specifies number of decimals shown
    document.getElementById("hum").innerHTML =`Humidity: ${humidity.toFixed(2)}%`;
  }else {
    
  }
});

function Load() {
  $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    console.log(data);
    database.ref("data/ids").on("value", snap => {
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
      str += toString(id);
      database.ref("data/val").set({id: client_data_save });

    });
  });
  
}

function increase() {
  clicks++;
  document.getElementById('click').innerHTML = "Bubble Clicks: " + clicks;
}

window.addEventListener("load", pageFullyLoaded, true);

function pageFullyLoaded() {

window.addEventListener("scroll", (event) => {
  let scroll = this.scrollY;
  let bg = document.getElementById("bg");
  if(scroll > 150) {
    sent = true;
    document.getElementById("title").style.opacity = "1";
    document.getElementById("temp").style.opacity = "1";
    document.getElementById("hum").style.opacity = "1";
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
  let objects = document.getElementsByClassName("bubbles");
  for(var i=0; i<objects.length; i++) {
      let randomx = Math.random()*100;
      let randomy = Math.random()*100;
      objects[i].style.transform = "translate(" + randomx.toString() + "px, " + randomy.toString() + "px)";
  }
}
  

}
