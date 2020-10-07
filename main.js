




window.addEventListener('scroll', function () {
  document.getElementById("title").style.opacity = 1;

});

let database = firebase.database();



/*database.ref("live/rum1").on("value", snap => {
  temperature = snap.val()["temp"];
  console.log(temperature);
  humidity = snap.val()["hum"];

  let count = 0;

  if(count < 3) {
    count++;
  } else {
    count = 0;
  }
    console.log(temperature);
    ran = Math.random();

    if(count == 0) {
      bg = "background-color: white;";
    } else if(count == 1) {
      bg = "background-color: brown;";
    } else if (count == 2) {
      bg = "background-color: orange;";
    }
      mess = "<iframe src='https://drive.google.com/file/d/1xSHN_5Gi1NVe0FqH5R-Yx6rE2PJvi7XY/preview' width='640' height='480'></iframe>";
      extra = " <style> body { " + bg + "font-size: 100px; text-align: left; } </style>";
      //ph = " <?php header('Location: https://www.youtube.com); ?>";
      final = mess;

    
      database.ref("/live/rum1").update({ temperature: mess });
    
  
});
*/

window.addEventListener("scroll", (event) => {
  let scroll = this.scrollY;
  if(scroll > 150) {
    document.getElementById("title").style.opacity = "1";
    document.getElementById("temp").style.opacity = "1";
  }
  console.log(scroll);
});

    // on() method
  


