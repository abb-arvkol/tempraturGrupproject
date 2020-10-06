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
}