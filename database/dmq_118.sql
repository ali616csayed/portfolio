-- Here are all the SQL queries that are used in the site to manipulate the date in the DB.

-- Selects details of physicians including their IDs, names, emails, phones, associated hospital names and IDs, and specialty names and IDs
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

-- Selects all records from Hospitals table
SELECT * FROM Hospitals;

-- Selects all records from Specialties table
SELECT * FROM Specialties;

-- Selects all records from Procedures table
SELECT * FROM Procedures;

-- Selects all records from Patients table
SELECT * FROM Patients;

-- Selects visit details including visit ID, date, hospital name, patient ID and name, physician name, procedures list, and total procedures cost, grouping by visit ID
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

-- Inserts a new specialty into the Specialties table
INSERT INTO Specialties (specialtyName)
VALUES ('${data.name}');

-- Inserts a new hospital into the Hospitals table
INSERT INTO Hospitals (hospitalName)
VALUES ('${data.name}');

-- Inserts a new procedure into the Procedures table with its description and cost
INSERT INTO Procedures (procedureDescription, procedureCost)
VALUES ('${data.description}', ${data.cost});

-- Inserts a new patient into the Patients table with their first name, last name, email, phone, and date of birth
INSERT INTO Patients (firstName, lastName, email, phone, dateOfBirth)
VALUES ('${data.fname}', '${data.lname}', '${data.email}', ${data.phone}, '${data.dob}');

-- Inserts a new physician into the Physicians table with their details including hospital and specialty IDs
INSERT INTO Physicians (firstName, lastName, email, phone, hospitalID, specialtyID)
VALUES ('${data.fname}', '${data.lname}', '${data.email}', ${data.phone}, ${data.hospital}, ${data.specialty});

-- Inserts a new visit record into the Visits table with hospital ID, patient ID, physician ID, and visit date
INSERT INTO Visits (hospitalID, patientID, physicianID, visitDate)
VALUES (${data.hospital}, ${data.patient}, ${data.physician}, '${data.date}');

-- Inserts a new record into VisitsProcedures table associating a visit with a procedure
INSERT INTO VisitsProcedures (visitID, procedureID)
VALUES (${data.id}, ${data.procedure});

-- Deletes a specialty from the Specialties table by its ID
DELETE FROM Specialties WHERE specialtyID = ?;

-- Deletes a hospital from the Hospitals table by its ID
DELETE FROM Hospitals WHERE hospitalID = ?;

-- Deletes a procedure from the Procedures table by its ID
DELETE FROM Procedures WHERE procedureID = ?;

-- Deletes a patient from the Patients table by their ID
DELETE FROM Patients WHERE patientID = ?;

-- Deletes a physician from the Physicians table by their ID
DELETE FROM Physicians WHERE physicianID = ?;

-- Deletes a visit record from the Visits table by its ID
DELETE FROM Visits WHERE visitID = ?;

-- Updates the name of a specialty in the Specialties table by its ID
UPDATE Specialties SET specialtyName = ? WHERE Specialties.specialtyID = ?;

-- Updates the name of a hospital in the Hospitals table by its ID
UPDATE Hospitals SET hospitalName = ? WHERE Hospitals.hospitalID = ?;
