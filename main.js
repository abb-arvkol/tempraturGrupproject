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

let grafCurveType = "function"

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

    document.getElementById("rum" + rum.toString()).innerHTML =
      temperature + "°C";
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

function bubbleClicks(bubble) {
  let snd = new Audio("plop-effect.mp3");
  snd.play();
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

window.addEventListener("load", pageFullyLoaded, true);

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

  document.getElementById("check").onclick = function () {
    if (this.checked) {
      $("html").css("filter", "invert(100%)");
    } else {
      $("html").css("filter", "invert(0%)");
    }
  };
}

//adding google charts

google.charts.load("current", { packages: ["corechart", "line"] });
google.charts.setOnLoadCallback(drawCurveTypes);
try {
  var daydata = new google.visualization.DataTable();
  var monthdata = new google.visualization.DataTable();
} catch {}
function drawCurveTypes() {
  database.ref("day/").on("value", (snap) => {
    long = snap.val();

    daydataGraphing();
  });

  database.ref("mon/").on("value", (snap) => {
    long1 = snap.val();
    monthdataGraphing();
  });

  chart = new google.visualization.LineChart(
    document.getElementById("chart_div")
  );
  monthchart = new google.visualization.LineChart(
    document.getElementById("monthchart_div")
  );
  
}

function drawnow() {
  chart.draw(daydata, options);
  monthchart.draw(monthdata, moptions);
}

function monthdataGraphing(){
  monthdata = new google.visualization.DataTable();
  monthdata.addColumn("number", "X");
  monthdata.addColumn("number", "rum1");
  monthdata.addColumn("number", "rum2");
  monthdata.addColumn("number", "rum3");
  monthdata.addColumn("number", "rum4");
  monthdata.addColumn("number", "rum5");

  console.log("-----------------------------------------------------");

  for (const i in long1) {
    let mkeys = Object.keys(long1[i]);
    dayAmount = 0;
    if (mkeys.length > dayAmount) {
      dayAmount = mkeys.length;
      days = mkeys;
    }
    if (mkeys.length > currDate.getDate()) {
      dayAmount = currDate.getDate();
    }
  }
  for (var k = 0; k < dayAmount; k++) {
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
    // chartArea: {
    //   left:100, top:100
    // },
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

function daydataGraphing(){
  daydata = new google.visualization.DataTable();
  daydata.addColumn("string", "X");
  daydata.addColumn("number", "rum1");
  daydata.addColumn("number", "rum2");
  daydata.addColumn("number", "rum3");
  daydata.addColumn("number", "rum4");
  daydata.addColumn("number", "rum5");

  

  console.log("-----------------------------------------------------");
  for (const i in long) {
    let keys = Object.keys(long[i]);
    dateAmount = 0;
    if (keys.length > dateAmount) {
      dateAmount = keys.length;
      hours = keys;
    }
    if (keys.length > currDate.getHours()) {
      dateAmount = currDate.getHours(); //getHours returns hour value from 0-23
    }
  }
  for (var j = 23; j > dateAmount; j--) {
    daydata.addRows([
      [
        String(hours[j]),
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
        String(hours[k]),
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
    hAxis: {
      title: "Hour",
    },
    vAxis: {
      title: "Temperature",
    },
    // chartArea: {
    //   left:100, top:100
    // },
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

function interpolate()
{
    if(grafCurveType == "function")
    {
      grafCurveType = "";
    }
    else
      grafCurveType = "function";

    monthdataGraphing();
    daydataGraphing();
}