let addProcedureForm = document.getElementById('add-procedure-form-ajax')

addProcedureForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputDescription = document.getElementById('input-description');
    let inputCost = document.getElementById('input-cost');

    let descriptionValue = inputDescription.value;
    let costValue = inputCost.value;

    let data = {
        description: descriptionValue,
        cost: costValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-procedure-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDescription.value = '';
            inputCost.value = '';

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
    let currentTable = document.getElementById("procedures-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 3 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let costCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.procedureID;
    descriptionCell.innerText = newRow.procedureDescription;
    costCell.innerText = newRow.procedureCost;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteProcedure(newRow.procedureID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(descriptionCell);
    row.appendChild(costCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.procedureID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("input-procedure-update");
    let option = document.createElement("option");
    option.text = newRow.procedureDescription;
    option.value = newRow.procedureID;
    selectMenu.add(option);
}