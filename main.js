

function run () {
    window.open("https://bonzi.link", "_self");

}

let database = firebase.database();

database.ref("live/testRum").on("value", snap => {
  temperature = snap.val()["temperature"];
  console.log(temperature);
  humidity = snap.val()["humidity"];

  
    temperature = snap.val()["temperature"];
    console.log(temperature);
    database.ref("/live/testRum").update({ temperature: "<input type='text' name='skriv'></input>" });
  
});

    // on() method
    



