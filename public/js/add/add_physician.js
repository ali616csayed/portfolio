let addPhysicianForm = document.getElementById('add-physician-form-ajax')

addPhysicianForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputFname = document.getElementById('input-fname');
    let inputLname = document.getElementById('input-lname');
    let inputEmail = document.getElementById('input-email');
    let inputPhone = document.getElementById('input-phone');
    let inputHospital = document.getElementById('input-hospital');
    let inputSpecialty = document.getElementById('input-specialty');

    let fnameValue = inputFname.value;
    let lnameValue = inputLname.value;
    let emailValue = inputEmail.value;
    let phoneValue = inputPhone.value;
    let hospitalValue = inputHospital.value;
    let specialtyValue = inputSpecialty.value;

    let data = {
        fname: fnameValue,
        lname: lnameValue,
        email: emailValue,
        phone: phoneValue,
        hospital: hospitalValue,
        specialty: specialtyValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-physician-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFname.value = '';
            inputLname.value = '';
            inputEmail.value = '';
            inputPhone.value = '';
            inputHospital.value = '';
            inputSpecialty.value = '';
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
    let currentTable = document.getElementById("physicians-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 3 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let fnameCell = document.createElement("TD");
    let lnameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let hospitalCell = document.createElement("TD");
    let specialtyCell = document.createElement("TD");


    let deleteCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.physicianID;
    fnameCell.innerText = newRow.firstName;
    lnameCell.innerText = newRow.lastName;
    emailCell.innerText = newRow.email;
    phoneCell.innerText = newRow.phone;
    hospitalCell.innerText = newRow.hospitalName;
    specialtyCell.innerText = newRow.specialtyName;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deletePhysician(newRow.physicianID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(fnameCell);
    row.appendChild(lnameCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);
    row.appendChild(hospitalCell);
    row.appendChild(specialtyCell);

    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.physicianID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("input-physician-update");
    let option = document.createElement("option");
    option.text = newRow.firstName + ' ' + newRow.lastName;
    option.value = newRow.physicianID;
    selectMenu.add(option);
}