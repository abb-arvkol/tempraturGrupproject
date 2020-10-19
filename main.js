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
let livesnap;
let room = rooms[0];

let hours = [];
let days = [];
var moptions;
let long,
    long1;

window.onload = Load;

document.addEventListener('contextmenu', event => event.preventDefault());//prevents contextmenu from poping up

//database.ref("live/").on("value", snap => {//checks if value paramater changes in the database reference and takes a data snapshot of set value


  // snapval = snap.val();//extracts the contents of the snapshot as a JS object
  
  // temperature = snapval["rum1"]["temp"];//sets temp to the value in temperature in the snapval object
  // console.log(temperature);
  // humidity = snapval["rum1"]["hum"];// sets humitity to the value in humitity in the snapval object

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
  for(let i=1; i<6; i++) {
    updateLiveValue(rooms.indexOf(room)+1, i); // change tha last parameter for decimals
  }
});

// database.ref("long/").on("value", snap => {
//   snapval = snap.val();

//   for(var i in snapval)
//   {
//     for(var j in snapval[i])
//     {
//       console.log(snapval[i][j]["temp"]);
//     }
//   }

// });

function Load() {
  newRoom();
  $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    console.log(data);
      client_data_save = data;
      console.log(client_data_save);
      let i = 0;
      let str = snap.val()["ids"];
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
  updateLiveValue(rooms.indexOf(room)+1, livesnap);
  newRoom();
}

function newRoom() {
  let title = document.getElementById("title");
  console.log(room);
  if(title.innerHTML == room) return;
  title.innerHTML = "snatch";
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
      let chart = document.getElementById("chart_div");
      chart.style.opacity = "1";
      chart.style.transform = "translateX(30px)";
      let monthchart = document.getElementById("monthchart_div");
      monthchart.style.opacity = "1";
      monthchart.style.transform = "translateX(30px)";
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

//adding google charts

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawCurveTypes);

function drawCurveTypes() {
      var daydata = new google.visualization.DataTable();
      var monthdata = new google.visualization.DataTable();
      daydata.addColumn('number', 'X');
      daydata.addColumn('number', 'rum1');
      daydata.addColumn('number', 'rum2');
      daydata.addColumn('number', 'rum3');
      //data.addColumn('number', 'rum4');
      //data.addColumn('number', 'rum5');

      monthdata.addColumn('number', 'X');
      monthdata.addColumn('number', 'rum1');
      monthdata.addColumn('number', 'rum2');
      monthdata.addColumn('number', 'rum3');
      //monthdata.addColumn('number', 'rum4');
      //monthdata.addColumn('number', 'rum5');
      
      database.ref("day/").on("value", snap => {
        long = snap.val();

         console.log("-----------------------------------------------------");

         let dateAmount = 0;
         for (const i in long) {
           let keys = Object.keys(long[i]);

           if (keys.length > dateAmount) {
             dateAmount = keys.length;
             hours = keys;
           }
        }
        for(var k in hours)
        {
          daydata.addRows([[parseInt(hours[k]), long["rum1"][hours[k]]["temp"],long["rum2"][hours[k]]["temp"],long["rum3"][hours[k]]["temp"]]]);
        }
        drawnow();
        console.log(hours);

      });
      var options = {
        hAxis: {
          title: 'Hour',
          gridlines:{count:24},
        },
        vAxis: {
          title: 'Temperature'
        },
        // chartArea: {
        //   left:100, top:100
        // },
        series: {
          //1: {curveType: 'function'}
        },
        legend: { 
          position: 'bottom' //sets chart position
        },
        backgroundColor: {
          fill: 'transparent'
        }
        
      };

     


      database.ref("mon/").on("value", snap => {
        long1 = snap.val();

        console.log("-----------------------------------------------------");

        let monthAmount = 0;
        for (const i in long1) {
          let mkeys = Object.keys(long1[i]);

         if (mkeys.length > monthAmount) {
           monthAmount = mkeys.length;
           days = mkeys;
         }
        }
        for(var k in days)
        {
          monthdata.addRows([[parseInt(days[k]), long1["rum1"][days[k]]["temp"],long1["rum2"][days[k]]["temp"],long1["rum3"][days[k]]["temp"]]]);
        }
        moptions = {
          hAxis: {
            title: 'Day',
            gridlines:{count: days.length},
          },
          vAxis: {
            title: 'Temperature'
          },
          // chartArea: {
          //   left:100, top:100
          // },
          series: {
            //1: {curveType: 'function'}
          },
          legend: {
            position: 'bottom'
          },
          backgroundColor: {
            fill: 'transparent'
          }
        };

        drawnow();
        console.log(days);

      });

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    var monthchart = new google.visualization.LineChart(document.getElementById('monthchart_div'));
    function drawnow(){
      chart.draw(daydata, options);
      monthchart.draw(monthdata,moptions);
   }
}
