let addVisitForm = document.getElementById('add-visit-form-ajax')

addVisitForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputHospital = document.getElementById('input-hospital');
    let inputPatient = document.getElementById('input-patient')
    let inputPhysician = document.getElementById('input-physician')
    let inputDate = document.getElementById('input-date')


    let hospitalValue = inputHospital.value;
    let patientValue = inputPatient.value;
    let physicianValue = inputPhysician.value;
    let dateValue = inputDate.value;

    let data = {
        hospital: hospitalValue,
        patient: patientValue,
        physician: physicianValue,
        date: dateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-visit-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputHospital.value = '';
            inputPatient.value = '';
            inputPhysician.value = '';
            inputDate.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("visits-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 3 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let hospitalCell = document.createElement("TD");
    let patientCell = document.createElement("TD");
    let physicianCell = document.createElement("TD");
    let proceduresCell = document.createElement("TD");
    let costCell = document.createElement("TD");


    let deleteCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.visitID;
    dateCell.innerText = newRow.visitDate;
    hospitalCell.innerText = newRow.hospitalName;
    patientCell.innerText = newRow.patientName;
    physicianCell.innerText = newRow.physicianName;
    proceduresCell.innerText = newRow.proceduresList;
    costCell.innerText = newRow.totalProceduresCost;


    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteVisit(newRow.visitID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(dateCell);
    row.appendChild(hospitalCell);
    row.appendChild(patientCell);
    row.appendChild(physicianCell);
    row.appendChild(proceduresCell);
    row.appendChild(costCell);

    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.visitID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu1 = document.getElementById("input-visit-proc");
    let selectMenu2 = document.getElementById("input-visit-date");

    let option1 = document.createElement("option");
    option1.text = newRow.visitID;
    option1.value = newRow.visitID;
    let option2 = document.createElement("option");
    option2.text = newRow.visitID;
    option2.value = newRow.visitID;

    selectMenu1.add(option1);
    selectMenu2.add(option2);
}