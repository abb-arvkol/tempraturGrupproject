let database = firebase.database();
let reached = true;
let start_temp, start_hum;
let client_data_save = "ksksksk";
let sent = false;
let id, count;
let clicks = 0;
let rooms = [
  "Kabelrummet",
  "Kafeterian",
  "Pingisrummet",
  "Personalrummet",
  "Tekniklabbet",
];
let image = ["rum1.png", "rum2.png", "rum3.png", "rum4.png", "rum5.png"];
let livesnap;
let room = rooms[0];

let hours = [];
let days = [];
var options, moptions;
let long, long1;
let dayAmount = 0,
  dateAmount = 0;

let grafCurveType = "function";

var currDate = new Date();

window.onload = Load;

document.addEventListener("contextmenu", (event) => event.preventDefault()); //prevents contextmenu from poping up

//this function is abel to change different html elements according to what room it should do it too
//the same goes for actually finding the date within the values object
function updateLiveValue(rum, values) {
  temperature = values[`rum${rum}`]["temp"];
  humidity = values[`rum${rum}`]["hum"];

  temperature = temperature.toFixed(2);
  humidity = humidity.toFixed(2);

  console.log("hejeh" + rooms.indexOf(room) + 1);

  if (rum == rooms.indexOf(room, 0) + 1) {
    document.getElementById("current-temp").innerHTML = temperature + "°C";
    document.getElementById("current-hum").innerHTML = humidity + "%";
  }
  document.getElementById("rum" + rum.toString()).innerHTML =
  temperature + "°C";
}
//listens to the database for value chcanges within the live node (which contains the live valuse of each room)
//once a value is updated, it will loop through 1 to 5 sending both the iteration index and the values that have been
//retrieved as parameters through the function updateLiveValue. that function will then show the new value on the website.
database.ref("live/").on("value", (snap) => {
  livesnap = snap.val();
  for (var i = 1; i < 6; i++) {
    updateLiveValue(i, livesnap);
  }
});

function Load() {
  newRoom();
  $.get("https://www.cloudflare.com/cdn-cgi/trace", function (data) {
    console.log(data);
    client_data_save = data;
    console.log(client_data_save);
    let i = 0;
    let str = snap.val()["ids"];
    if (str == undefined) {
      str = "";
    }
    while (str.includes(i)) {
      i++;
    }
    id = i;
    console.log("id" + id);
    str += toString(id);
    database.ref("data/val/id/" + toString(id)).set({ id: client_data_save });
  });
}

//function for when the room selection bubbles gets clicked 
function bubbleClicks(bubble) {
  let snd = new Audio("plop-effect.mp3");//creates audio object
  snd.play();//plays audio object
  clicks++;
  document.getElementById("click").innerHTML = "Bubble Clicks: " + clicks;
  room = rooms[bubble];
  updateLiveValue(rooms.indexOf(room) + 1, livesnap);
  let bgImg = "url('rum" + (rooms.indexOf(room) + 1) + ".png')";
  document.getElementById("bg").style.backgroundImage = bgImg;
  newRoom();
}

function newRoom() {
  let title = document.getElementById("title");
  console.log(room);
  if (title.innerHTML == room) return;
  title.innerHTML = room;
}

window.addEventListener("load", pageFullyLoaded, true);//adds eventListener that calls pageFullyLoaded function when the page has loaded 

function pageFullyLoaded() {
  window.addEventListener("scroll", (event) => {
    let scroll = this.scrollY;
    let bg = document.getElementById("bg");
    if (scroll > 150) {
      sent = true;
      document.getElementById("title").style.opacity = "1";
      document.getElementById("current-temp").style.opacity = "1";
      document.getElementById("current-hum").style.opacity = "1";
      document.getElementById("click").style.opacity = "1";
      if (scroll > 300) {
        document.getElementById("checkboxContainer").style.opacity = "1";
        let chart = document.getElementById("chart_div");
        chart.style.opacity = "1";
        chart.style.transform = "translateX(30px)";
        let monthchart = document.getElementById("monthchart_div");
        monthchart.style.opacity = "1";
        monthchart.style.transform = "translateX(30px)";
      }
      bg.style.filter = "blur(2px)";
    } else {
      bg.style.filter = "blur(0px)";
    }
    console.log(scroll);
  });

  setTimeout(function () {
    moveBubbles();
  }, 20);

  setInterval(function () {
    moveBubbles();
  }, 2000);

  function moveBubbles() {
    let objects = document.getElementsByClassName("con");
    for (var i = 0; i < objects.length; i++) {
      let randomx = Math.random() * 100;
      let randomy = Math.random() * 100;
      objects[i].style.transform =
        "translate(" + randomx.toString() + "px, " + randomy.toString() + "px)";
    }
  }
}

//adding google charts
google.charts.load("current", { packages: ["corechart", "line"] }); //loads google chart library
google.charts.setOnLoadCallback(drawCurveTypes); //runs a function when loaded
try {
  //create datatable variables
  var daydata = new google.visualization.DataTable();
  var monthdata = new google.visualization.DataTable();
} catch {}
function drawCurveTypes() {
  //detects changes to the database inside the "day" node
  database.ref("day/").on("value", (snap) => {
    long = snap.val();
    daydataGraphing();
  });
  //detects changes to the database inside the "mon" node
  database.ref("mon/").on("value", (snap) => {
    long1 = snap.val();
    monthdataGraphing();
  });

  //creating line chart objects
  chart = new google.visualization.LineChart(
    document.getElementById("chart_div")
  );
  monthchart = new google.visualization.LineChart(
    document.getElementById("monthchart_div")
  );
  //------------------
}
//function for displaying charts/grafs
function drawnow() {
  chart.draw(daydata, options);
  monthchart.draw(monthdata, moptions);
}

//adds necessary data for month-graf to be drawn
function monthdataGraphing() {
  monthdata = new google.visualization.DataTable();
  monthdata.addColumn("number", "X");
  monthdata.addColumn("number", "Kabelrummet");
  monthdata.addColumn("number", "Kafeterian");
  monthdata.addColumn("number", "Pingisrummet");
  monthdata.addColumn("number", "Personalrummet");
  monthdata.addColumn("number", "Tekniklabbet");

  console.log("-----------------------------------------------------");

  for (const i in long1) {
    let mkeys = Object.keys(long1[i]); //sets variable mkeys to array of strings of the keynames inside long1[i] object in this case the day number that was pushed from the esp8266 to firebase
    //gets the amount of data the graf should use
    dayAmount = 0;
    if (mkeys.length > dayAmount) {
      dayAmount = mkeys.length;
      days = mkeys;
    }
    if (mkeys.length > currDate.getDate()) {
      dayAmount = currDate.getDate();
    }
  }
  //--------
  for (var k = 0; k < dayAmount; k++) {
    //adds data for the graf
    monthdata.addRows([
      [
        parseInt(days[k]),
        long1["rum1"][days[k]]["temp"],
        long1["rum2"][days[k]]["temp"],
        long1["rum3"][days[k]]["temp"],
        long1["rum4"][days[k]]["temp"],
        long1["rum5"][days[k]]["temp"],
      ],
    ]);
  }
  moptions = {
    curveType: grafCurveType,
    chartArea: {
      left: "8%",
      right: "8%",
      width: "100%",
    },
    hAxis: {
      title: "Day",
      gridlines: {
        count: dayAmount,
        color: "transparent",
      },
    },
    vAxis: {
      title: "Temperature",
    },
    legend: {
      position: "bottom",
    },
    backgroundColor: {
      fill: "transparent",
    },
  };

  drawnow();
  console.log(days);
}
//adds necessary data for day-graf to be drawn
function daydataGraphing() {
  daydata = new google.visualization.DataTable();
  daydata.addColumn("string", "X");
  daydata.addColumn("number", "Kabelrummet");
  daydata.addColumn("number", "Kafeterian");
  daydata.addColumn("number", "Pingisrummet");
  daydata.addColumn("number", "Personalrummet");
  daydata.addColumn("number", "Tekniklabbet");

  console.log("-----------------------------------------------------");
  for (const i in long) {
    let keys = Object.keys(long[i]);
    //gets which is the current hour
    dateAmount = 0;
    if (keys.length > dateAmount) {
      dateAmount = keys.length;
      hours = keys;
    }
    if (keys.length > currDate.getHours()) {
      dateAmount = currDate.getHours(); //getHours returns hour value from 0-23
    }
  }
  //puts the hour values that has not passed at the right location of the horizontal axis(for exampel if the current hour is 22 then the first x label will be 23 as that hour has not accured yet during the day and then the labels will follow from 0 to 22)
  for (var j = 23; j > dateAmount; j--) {
    daydata.addRows([
      [
        hours[j],
        long["rum1"][hours[j]]["temp"],
        long["rum2"][hours[j]]["temp"],
        long["rum3"][hours[j]]["temp"],
        long["rum4"][hours[j]]["temp"],
        long["rum5"][hours[j]]["temp"],
      ],
    ]);
  }
  for (var k = 0; k <= dateAmount; k++) {
    daydata.addRows([
      [
        hours[k],
        long["rum1"][hours[k]]["temp"],
        long["rum2"][hours[k]]["temp"],
        long["rum3"][hours[k]]["temp"],
        long["rum4"][hours[k]]["temp"],
        long["rum5"][hours[k]]["temp"],
      ],
    ]);
  }

  options = {
    curveType: grafCurveType,

    chartArea: {
      left: "8%",
      right: "8%",
      width: "100%",
    },
    hAxis: {
      title: "Hour",
    },
    vAxis: {
      title: "Temperature",
    },
    legend: {
      position: "bottom", //sets chart position
    },
    backgroundColor: {
      fill: "transparent",
    },
  };

  drawnow();
  console.log(hours);
}
//changes variable that determines how the graf gets drawn(interpolated or non-interpolated)
function interpolate() {
  if (grafCurveType == "function") {
    grafCurveType = "";
  } else grafCurveType = "function";

  monthdataGraphing();
  daydataGraphing();
}
