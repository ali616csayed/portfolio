
// Get the objects we need to modify
let updatePhysicianForm = document.getElementById('update-physician-form-ajax');

// Modify the objects we need
updatePhysicianForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("input-physician-update");
    let inputHospital = document.getElementById("input-hospital-update");

    // Get the values from the form fields
    let idValue = inputID.value;
    let hospitalValue = inputHospital.value;

    // Put our data we want to send in a javascript object
    let data = {
        id: idValue,
        hospital: hospitalValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-physician-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
            console.log(xhttp.status)
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, idValue) {
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let table = document.getElementById("physicians-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == idValue) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of name value
            let td1 = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign name to our value we updated to
            td1.innerHTML = parsedData[0].hospitalName;
        }
    }
}
