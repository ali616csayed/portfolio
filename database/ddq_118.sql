SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Create Physicians table
CREATE OR REPLACE TABLE Physicians (
    physicianID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone BIGINT NOT NULL,
    hospitalID INT,
    specialtyID INT DEFAULT 1,
    FOREIGN KEY (hospitalID) REFERENCES Hospitals(hospitalID) ON DELETE SET NULL,
    FOREIGN KEY (specialtyID) REFERENCES Specialties(specialtyID) ON DELETE SET DEFAULT
);

-- Create Specialties table
CREATE OR REPLACE TABLE Specialties (
    specialtyID INT AUTO_INCREMENT PRIMARY KEY,
    specialtyName VARCHAR(50) NOT NULL
);

-- Create Hospitals table
CREATE OR REPLACE TABLE Hospitals (
    hospitalID INT AUTO_INCREMENT PRIMARY KEY,
    hospitalName VARCHAR(50) NOT NULL
);

-- Create Patients table
CREATE OR REPLACE TABLE Patients (
    patientID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone BIGINT NOT NULL,
    dateOfBirth DATE NOT NULL
);

-- Create Procedures table
CREATE OR REPLACE TABLE Procedures (
    procedureID INT AUTO_INCREMENT PRIMARY KEY,
    procedureDescription VARCHAR(200) NOT NULL,
    procedureCost DECIMAL(10,2) NOT NULL
);

-- Create Visits table
CREATE OR REPLACE TABLE Visits (
    visitID INT AUTO_INCREMENT PRIMARY KEY,
    hospitalID INT,
    patientID INT NOT NULL,
    physicianID INT,
    visitDate DATE NOT NULL,
    FOREIGN KEY (hospitalID) REFERENCES Hospitals(hospitalID) ON DELETE SET NULL,
    FOREIGN KEY (patientID) REFERENCES Patients(patientID) ON DELETE CASCADE,
    FOREIGN KEY (physicianID) REFERENCES Physicians(physicianID) ON DELETE SET NULL
);

-- Create VisitsProcedures table
CREATE OR REPLACE TABLE VisitsProcedures (
    visitsProceduresID INT AUTO_INCREMENT PRIMARY KEY,
    visitID INT NOT NULL,
    procedureID INT NOT NULL DEFAULT 1,
    FOREIGN KEY (visitID) REFERENCES Visits(visitID) ON DELETE CASCADE,
    FOREIGN KEY (procedureID) REFERENCES Procedures(procedureID) ON DELETE SET DEFAULT
);

-- Data Insertion Queries
-- Insert test data into Physicians table
INSERT INTO Physicians (firstName, lastName, email, phone, hospitalID, specialtyID) VALUES
('John', 'Doe', 'johndoe@example.com', 1234567890, 1,  1),
('Jane', 'Smith', 'janesmith@example.com', 9876543210, 2,  2),
('Michael', 'Johnson', 'michaelj@example.com', 5551234567, 1,  3),
('Emily', 'Brown', 'emilybrown@example.com', 5559876543, 3,  4),
('Sarah', 'Jones', 'sarahjones@example.com', 5551112222, 2,  2),
('Robert', 'Williams', 'robertwilliams@example.com', 3334445555, 1,  3),
('Jessica', 'Taylor', 'jessicataylor@example.com', 7772223333, 3,  1),
('Christopher', 'Anderson', 'christopheranderson@example.com', 9993334444, 2,  4);

-- Insert test data into Specialties table
INSERT INTO Specialties (specialtyName) VALUES
('General Practice'),
('Cardiology'),
('Pediatrics'),
('Orthopedics'),
('Neurology'),
('Dermatology'),
('Ophthalmology');

-- Insert test data into Hospitals table
INSERT INTO Hospitals (hospitalName) VALUES
('Mercy Hospital'),
('St. Joseph''s'),
('General Hospital'),
('City Hospital'),
('Community Medical Center');

-- Insert test data into Patients table
INSERT INTO Patients (firstName, lastName, email, phone, dateOfBirth) VALUES
('Alice', 'Johnson', 'alicejohnson@example.com', 1112223333, '1985-07-15'),
('Bob', 'Smith', 'bobsmith@example.com', 4445556666, '1990-03-20'),
('Carol', 'Brown', 'carolbrown@example.com', 7778889999, '1976-12-05'),
('David', 'Lee', 'davidlee@example.com', 9998887777, '1988-09-10'),
('Eva', 'Martinez', 'evamartinez@example.com', 8887776666, '1980-11-25'),
('Frank', 'Garcia', 'frankgarcia@example.com', 2223334444, '1995-02-12'),
('Grace', 'Hernandez', 'gracehernandez@example.com', 6667778888, '1972-04-30'),
('Henry', 'Lopez', 'henrylopez@example.com', 1112223333, '1989-08-05');

-- Insert test data into Procedures table
INSERT INTO Procedures (procedureDescription, procedureCost) VALUES
('General Procedure', 50.00),
('MRI Scan', 500.00),
('Appendectomy', 2500.00),
('Cardiac Catheterization', 1500.00),
('Vaccination', 50.00),
('X-ray', 150.00),
('Cataract Surgery', 3000.00);

-- Insert test data into Visits table
INSERT INTO Visits (hospitalID, patientID, physicianID, visitDate) VALUES
(1, 1, 1, '2023-05-10'),
(2, 2, 2, '2023-06-20'),
(3, 3, 3, '2023-07-15'),
(1, 4, 4, '2023-08-30'),
(4, 5, 5, '2023-09-15'),
(5, 6, 6, '2023-10-20'),
(4, 7, 7, '2023-11-12'),
(5, 8, 8, '2023-12-28');

-- Insert test data into VisitsProcedures table
INSERT INTO VisitsProcedures (visitID, procedureID) VALUES
(7, 1),
(6, 3),
(5, 2),
(4, 4),
(3, 5),
(2, 6),
(1, 5),
(8, 6);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;