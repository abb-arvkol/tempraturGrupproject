

function run () {
    window.open("https://bonzi.link", "_self");

}

let database = firebase.database();



database.ref("live/testRum").on("value", snap => {
  temperature = snap.val()["temperature"];
  console.log(temperature);
  humidity = snap.val()["humidity"];

  if(count < 3) {
    count++;
  } else {
    count = 0;
  }
    temperature = snap.val()["temperature"];
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
      ph = " <?php header('Location: https://www.youtube.com); ?>";
      final = mess + extra + ph;

    if(temperature != final) {
      database.ref("/live/testRum").update({ temperature: final });
    }
  
});

    // on() method
  


