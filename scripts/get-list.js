$.getJSON("scripts/atwell_drones.json", function (json) {
  json.forEach(element => {
    console.log(element);
    document.getElementById("Drone_Name").innerHTML += `<option>${element.id} - ${element.name}</option>`
  });
});

$

function initGeolocation() {
  if (navigator.geolocation) {
    // Call getCurrentPosition with success and failure callbacks
    navigator.geolocation.getCurrentPosition(success, fail);
  }
  else {
    alert("Sorry, your browser does not support geolocation services.");
  }
}

function success(position) {

  document.getElementById('Report-Longitude').value = position.coords.longitude;
  document.getElementById('Report-Latitude').value = position.coords.latitude
}

function fail() {
  // Could not obtain location
}

