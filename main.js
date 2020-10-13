let database = firebase.database();
let reached = true;
let start_temp, start_hum;
let client_data_save = "ksksksk";
let sent = false;
let id;

window.onload = Load;

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

window.addEventListener("load", pageFullyLoaded, true);

function pageFullyLoaded() {

window.addEventListener("scroll", (event) => {
  let scroll = this.scrollY;
  let bg = document.getElementById("bg");
  if(scroll > 150) {
    document.getElementById("title").style.opacity = "1";
    document.getElementById("temp").style.opacity = "1";
    document.getElementById("hum").style.opacity = "1";
    bg.style.filter = "blur(2px)";
  }else{
    bg.style.filter = "blur(0px)";
  }
  if(scroll > 300) {
    let chart = document.getElementById("curve_chart")
    chart.style.opacity = "1";
    chart.style.transform = "translateX(30px)";
  }
  console.log(scroll);
});

}
  


