/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
PORT = 7576;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');     // Import express-handlebars
const Handlebars = require('handlebars');

// setting up handlebars helpers to allow evaluation in templates
Handlebars.registerHelper('eq', function (arg1, arg2, options) {
    return arg1 === arg2;
});

Handlebars.registerHelper('or', function (arg1, arg2, options) {
    return arg1 || arg2;
});

app.engine('.hbs', engine({ extname: ".hbs", handlebars: Handlebars }));
app.set('view engine', '.hbs');

// Promsifying Connection
const util = require('util');

/*
    ROUTES
*/
// GET ROUTES
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/physicians', async function (req, res) {
    let query1 = `
    SELECT 
        p.physicianID, 
        p.firstName, 
        p.lastName, 
        p.email, 
        p.phone, 
        h.hospitalName,
        s.specialtyName,
        h.hospitalID,
        s.specialtyID
    FROM Physicians p
    LEFT JOIN Hospitals h ON p.hospitalID = h.hospitalID
    LEFT JOIN Specialties s ON p.specialtyID = s.specialtyID;
    `;
    let query2 = "SELECT * FROM Hospitals;";
    let query3 = "SELECT * FROM Specialties;";

    // Wrap the query in a Promise
    const queryPromise = (query) => new Promise((resolve, reject) => {
        db.pool.query(query, (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });

    try {
        // Use Promise.all to execute all queries concurrently and wait for all of them to complete
        const [physicians, hospitals, specialties] = await Promise.all([
            queryPromise(query1),
            queryPromise(query2),
            queryPromise(query3)
        ]);

        // Pass the results to the template
        res.render('physicians', {
            physicians: physicians,
            hospitals: hospitals,
            specialties: specialties
        });
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).send("An error occurred while fetching data");
    }
});


app.get('/hospitals', function (req, res) {
    let query1 = "SELECT * FROM Hospitals;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('hospitals', { data: rows });
    })
});

app.get('/specialties', function (req, res) {
    let query1 = "SELECT * FROM Specialties;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('specialties', { data: rows });
    })
});

app.get('/procedures', function (req, res) {
    let query1 = "SELECT * FROM Procedures;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('procedures', { data: rows });
    })
});

app.get('/patients', function (req, res) {
    let query1 = "SELECT * FROM Patients;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('patients', { data: rows });
    })
});

app.get('/visits', async function (req, res) {
    let query1 = `
    SELECT
    v.visitID,
    v.visitDate,
    h.hospitalName,
    pt.patientID,
    CONCAT(pt.firstName, ' ', pt.lastName) AS patientName,
    CONCAT(ph.firstName, ' ', ph.lastName) AS physicianName,
    GROUP_CONCAT(pr.procedureDescription SEPARATOR ', ') AS proceduresList,
    SUM(pr.procedureCost) AS totalProceduresCost
    FROM Visits v
    LEFT JOIN VisitsProcedures vp ON v.visitID = vp.visitID
    LEFT JOIN Procedures pr ON vp.procedureID = pr.procedureID
    JOIN Patients pt ON v.patientID = pt.patientID
    JOIN Physicians ph ON v.physicianID = ph.physicianID
    JOIN Hospitals h ON v.hospitalID = h.hospitalID
    GROUP BY v.visitID
    ORDER BY v.visitID;
    `;
    let query2 = "SELECT * FROM Hospitals;";
    let query3 = "SELECT * FROM Patients;";
    let query4 = "SELECT * FROM Physicians;";
    let query5 = "SELECT * FROM Procedures;";

    // Wrap the query in a Promise
    const queryPromise = (query) => new Promise((resolve, reject) => {
        db.pool.query(query, (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });

    try {
        // Use Promise.all to execute all queries concurrently and wait for all of them to complete
        const [visits, hospitals, patients, physicians, procedures] = await Promise.all([
            queryPromise(query1),
            queryPromise(query2),
            queryPromise(query3),
            queryPromise(query4),
            queryPromise(query5)
        ]);

        // Pass the results to the template
        res.render('visits', {
            visits: visits,
            hospitals: hospitals,
            patients: patients,
            physicians: physicians,
            procedures: procedures
        });
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).send("An error occurred while fetching data");
    }
});


//POST ROUTES
app.post('/add-specialty-ajax', function (req, res) {
    let data = req.body;
    query1 = `INSERT INTO Specialties (specialtyName)
              VALUES ('${data.name}')`

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Specialties;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })

});

app.post('/add-hospital-ajax', function (req, res) {
    let data = req.body;
    query1 = `INSERT INTO Hospitals (hospitalName)
              VALUES ('${data.name}')`

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Hospitals;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })

});


app.post('/add-procedure-ajax', function (req, res) {
    let data = req.body;
    query1 = `INSERT INTO Procedures (procedureDescription, procedureCost)
              VALUES ('${data.description}', ${data.cost})`

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Procedures;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })

});

app.post('/add-patient-ajax', function (req, res) {
    let data = req.body;
    query1 = `INSERT INTO Patients (firstName, lastName, email, phone, dateOfBirth)
              VALUES ('${data.fname}', '${data.lname}', '${data.email}', ${data.phone}, '${data.dob}')`

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Patients;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })

});

app.post('/add-physician-ajax', function (req, res) {
    let data = req.body;
    query1 = `INSERT INTO Physicians (firstName, lastName, email, phone, hospitalID, specialtyID)
              VALUES ('${data.fname}', '${data.lname}', '${data.email}', ${data.phone}, ${data.hospital}, ${data.specialty})`

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `
            SELECT 
                p.physicianID, 
                p.firstName, 
                p.lastName, 
                p.email, 
                p.phone, 
                h.hospitalName,
                s.specialtyName,
                h.hospitalID,
                s.specialtyID
            FROM Physicians p
            LEFT JOIN Hospitals h ON p.hospitalID = h.hospitalID
            LEFT JOIN Specialties s ON p.specialtyID = s.specialtyID
            WHERE ;
            `;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })

});

app.post('/add-visit-ajax', function (req, res) {
    let data = req.body;
    query1 = `INSERT INTO Visits (hospitalID, patientID, physicianID, visitDate)
              VALUES (${data.hospital}, ${data.patient}, ${data.physician}, '${data.date}')`

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `
            SELECT
            v.visitID,
            v.visitDate,
            h.hospitalName,
            pt.patientID,
            CONCAT(pt.firstName, ' ', pt.lastName) AS patientName,
            CONCAT(ph.firstName, ' ', ph.lastName) AS physicianName,
            GROUP_CONCAT(pr.procedureDescription SEPARATOR ', ') AS proceduresList,
            SUM(pr.procedureCost) AS totalProceduresCost
            FROM Visits v
            LEFT JOIN VisitsProcedures vp ON v.visitID = vp.visitID
            LEFT JOIN Procedures pr ON vp.procedureID = pr.procedureID
            JOIN Patients pt ON v.patientID = pt.patientID
            JOIN Physicians ph ON v.physicianID = ph.physicianID
            JOIN Hospitals h ON v.hospitalID = h.hospitalID
            GROUP BY v.visitID
            ORDER BY v.visitID;
        `;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })

        }
    })

});

app.post('/add-visit-procedure-ajax', function (req, res) {
    let data = req.body;
    query1 = `INSERT INTO VisitsProcedures (visitID, procedureID)
              VALUES (${data.id}, ${data.procedure})`

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `
            SELECT
            v.visitID,
            v.visitDate,
            h.hospitalName,
            pt.patientID,
            CONCAT(pt.firstName, ' ', pt.lastName) AS patientName,
            CONCAT(ph.firstName, ' ', ph.lastName) AS physicianName,
            GROUP_CONCAT(pr.procedureDescription SEPARATOR ', ') AS proceduresList,
            SUM(pr.procedureCost) AS totalProceduresCost
            FROM Visits v
            LEFT JOIN VisitsProcedures vp ON v.visitID = vp.visitID
            LEFT JOIN Procedures pr ON vp.procedureID = pr.procedureID
            JOIN Patients pt ON v.patientID = pt.patientID
            JOIN Physicians ph ON v.physicianID = ph.physicianID
            JOIN Hospitals h ON v.hospitalID = h.hospitalID
            WHERE v.visitID = ${data.id}
            GROUP BY v.visitID
            ORDER BY v.visitID;
        `;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })

        }
    })

});


//DELETE ROUTES
app.delete('/delete-specialty-ajax/', function (req, res, next) {
    let data = req.body;
    let specialtyID = parseInt(data.id);
    let deleteSpecialty = `DELETE FROM Specialties WHERE specialtyID = ?`;

    // Run the 1st query
    db.pool.query(deleteSpecialty, [specialtyID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

app.delete('/delete-hospital-ajax/', function (req, res, next) {
    let data = req.body;
    let hospitalID = parseInt(data.id);
    let deleteHospital = `DELETE FROM Hospitals WHERE hospitalID = ?`;

    // Run the 1st query
    db.pool.query(deleteHospital, [hospitalID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

app.delete('/delete-procedure-ajax/', function (req, res, next) {
    let data = req.body;
    let procedureID = parseInt(data.id);
    let deleteProcedure = `DELETE FROM Procedures WHERE procedureID = ?`;

    // Run the 1st query
    db.pool.query(deleteProcedure, [procedureID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

app.delete('/delete-patient-ajax/', function (req, res, next) {
    let data = req.body;
    let patientID = parseInt(data.id);
    let deletePatient = `DELETE FROM Patients WHERE patientID = ?`;

    // Run the 1st query
    db.pool.query(deletePatient, [patientID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

app.delete('/delete-physician-ajax/', function (req, res, next) {
    let data = req.body;
    let physicianID = parseInt(data.id);
    let deletePhysician = `DELETE FROM Physicians WHERE physicianID = ?`;

    // Run the 1st query
    db.pool.query(deletePhysician, [physicianID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

app.delete('/delete-visit-ajax/', function (req, res, next) {
    let data = req.body;
    let visitID = parseInt(data.id);
    let deleteVisit = `DELETE FROM Visits WHERE visitID = ?`;

    // Run the 1st query
    db.pool.query(deleteVisit, [visitID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

//PUT ROUTES
app.put('/put-specialty-ajax', function (req, res, next) {
    let data = req.body;

    let specialtyID = parseInt(data.id);
    let specialtyName = data.name;

    let queryUpdateName = `UPDATE Specialties SET specialtyName = ? WHERE Specialties.specialtyID = ?`;
    let selectSpecialty = `SELECT * FROM Specialties WHERE specialtyID = ?`

    // Run the 1st query
    db.pool.query(queryUpdateName, [specialtyName, specialtyID], function (error, rows, fields) {
        if (error) {

            console.log(error);
            res.sendStatus(400);
        }
        else {
            // Run the second query
            db.pool.query(selectSpecialty, [specialtyID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});


app.put('/put-hospital-ajax', function (req, res, next) {
    let data = req.body;

    let hospitalID = parseInt(data.id);
    let hospitalName = data.name;

    let queryUpdateName = `UPDATE Hospitals SET hospitalName = ? WHERE Hospitals.hospitalID = ?`;
    let selectHospital = `SELECT * FROM Hospitals WHERE hospitalID = ?`

    // Run the 1st query
    db.pool.query(queryUpdateName, [hospitalName, hospitalID], function (error, rows, fields) {
        if (error) {

            console.log(error);
            res.sendStatus(400);
        }
        else {
            // Run the second query
            db.pool.query(selectHospital, [hospitalID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-procedure-ajax', function (req, res, next) {
    let data = req.body;

    let procedureID = parseInt(data.id);
    let procedureCost = parseFloat(data.cost);

    let queryUpdateCost = `UPDATE Procedures SET procedureCost = ? WHERE Procedures.procedureID = ?`;
    let selectProcedure = `SELECT * FROM Procedures WHERE procedureID = ?`

    // Run the 1st query
    db.pool.query(queryUpdateCost, [procedureCost, procedureID], function (error, rows, fields) {
        if (error) {

            console.log(error);
            res.sendStatus(400);
        }
        else {
            // Run the second query
            db.pool.query(selectProcedure, [procedureID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-patient-ajax', function (req, res, next) {
    let data = req.body;

    let patientID = parseInt(data.id);
    let firstName = data.fname;
    let lastName = data.lname;

    let queryUpdateName = `UPDATE Patients SET firstName = ?, lastName = ? WHERE Patients.patientID = ?`;
    let selectPatient = `SELECT * FROM Patients WHERE patientID = ?`

    // Run the 1st query
    db.pool.query(queryUpdateName, [firstName, lastName, patientID], function (error, rows, fields) {
        if (error) {

            console.log(error);
            res.sendStatus(400);
        }
        else {
            // Run the second query
            db.pool.query(selectPatient, [patientID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-physician-ajax', function (req, res, next) {
    let data = req.body;

    let physicianID = parseInt(data.id);
    let hospitalID = parseInt(data.hospital);

    let queryUpdateHospital = `UPDATE Physicians SET hospitalID = ? WHERE Physicians.physicianID = ?`;
    let selectPhysician = `
        SELECT 
            p.physicianID, 
            p.firstName, 
            p.lastName, 
            p.email, 
            p.phone, 
            h.hospitalName,
            s.specialtyName,
            h.hospitalID,
            s.specialtyID
        FROM Physicians p
        LEFT JOIN Hospitals h ON p.hospitalID = h.hospitalID
        LEFT JOIN Specialties s ON p.specialtyID = s.specialtyID
        WHERE physicianID = ?;
        `;

    // Run the 1st query
    db.pool.query(queryUpdateHospital, [hospitalID, physicianID], function (error, rows, fields) {
        if (error) {

            console.log(error);
            res.sendStatus(400);
        }
        else {
            // Run the second query
            db.pool.query(selectPhysician, [physicianID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-visit-ajax', function (req, res, next) {
    let data = req.body;

    let visitID = parseInt(data.id);
    let visitDate = String(data.date);

    let queryUpdateDate = `UPDATE Visits SET visitDate = ? WHERE Visits.visitID = ?`;
    let selectVisit = `
        SELECT
        v.visitID,
        v.visitDate,
        h.hospitalName,
        pt.patientID,
        CONCAT(pt.firstName, ' ', pt.lastName) AS patientName,
        CONCAT(ph.firstName, ' ', ph.lastName) AS physicianName,
        GROUP_CONCAT(pr.procedureDescription SEPARATOR ', ') AS proceduresList,
        SUM(pr.procedureCost) AS totalProceduresCost
        FROM Visits v
        LEFT JOIN VisitsProcedures vp ON v.visitID = vp.visitID
        LEFT JOIN Procedures pr ON vp.procedureID = pr.procedureID
        JOIN Patients pt ON v.patientID = pt.patientID
        JOIN Physicians ph ON v.physicianID = ph.physicianID
        JOIN Hospitals h ON v.hospitalID = h.hospitalID
        WHERE v.visitID = ${data.id}
        GROUP BY v.visitID
        ORDER BY v.visitID;
        `;

    // Run the 1st query
    db.pool.query(queryUpdateDate, [visitDate, visitID], function (error, rows, fields) {
        if (error) {

            console.log(error);
            res.sendStatus(400);
        }
        else {
            // Run the second query
            db.pool.query(selectVisit, [visitID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});


/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});