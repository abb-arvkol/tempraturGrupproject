<<<<<<< HEAD
function run () {
    window.open("https://bonzi.link", "_self");
=======
let database = firebase.database()

let person = database.ref('/person').once('value').then(function(par)  {
  console.log(par.val().firstname)
})

function turnOnOffLight() {
  let myCheckBox = document.getElementById('checkbox')

  if (myCheckBox.checked) {
    document.getElementById('myImage').src='light-bulb-on.png'
    database.ref('/led').update({led:false})
  } else {
    document.getElementById('myImage').src='light-bulb-off.png'
    database.ref('/led').update({led:true})
  }
>>>>>>> 87fc1ad6845bac3ba51d7b5cbdef788fbaee8b21
}