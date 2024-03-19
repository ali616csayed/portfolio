let addVisitProcedureForm = document.getElementById('update-visit-procedure-form-ajax')

addVisitProcedureForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputID = document.getElementById('input-visit-proc');
    let inputProcedure = document.getElementById('input-procedures-update')

    let idValue = inputID.value;
    let procedureValue = inputProcedure.value;

    let data = {
        id: idValue,
        procedure: procedureValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-visit-procedure-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idValue);

            // Clear the input fields for another transaction
            inputID.value = '';
            inputProcedure.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, idValue) {
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let table = document.getElementById("visits-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == idValue) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of name value
            let td1 = updateRowIndex.getElementsByTagName("td")[5];
            let td2 = updateRowIndex.getElementsByTagName("td")[6];

            // Reassign name to our value we updated to
            td1.innerHTML = parsedData[0].proceduresList;
            td2.innerHTML = parsedData[0].totalProceduresCost;
        }
    }
}