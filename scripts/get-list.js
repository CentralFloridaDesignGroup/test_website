$.getJSON("scripts/atwell_drones.json", function(json) {
  json.forEach(element => {
    console.log(element);
    document.getElementById("Drone_Name").innerHTML += `<option>${element.id} - ${element.name}</option>`
  });
});