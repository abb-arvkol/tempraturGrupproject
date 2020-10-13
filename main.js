let database = firebase.database();

database.ref("live/").on("value", snap => {//checks if value paramater changes in the database reference and takes a data snapshot of set value
  snapval = snap.val();//extracts the contents of the snapshot as a JS object
  
  temperature = snapval["rum1"]["temp"];//sets temp to the value in temperature in the snapval object
  console.log(temperature);
  humidity = snapval["rum1"]["hum"];// sets humitity to the value in humitity in the snapval object

  document.getElementById("temp").innerHTML = `temperature:${temperature.toFixed(5)}℃`;//toFixed method specifies number of decimals shown
  document.getElementById("hum").innerHTML =`humidity:${humidity.toFixed(5)}`;
});

window.addEventListener("scroll", (event) => {
  let scroll = this.scrollY;
  if(scroll > 150) {
    document.getElementById("title").style.opacity = "1";
    document.getElementById("temp").style.opacity = "1";
  }
  console.log(scroll);
});
  


