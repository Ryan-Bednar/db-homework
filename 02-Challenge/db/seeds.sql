INSERT INTO department (name) 
VALUES  ('HR'),
        ('Engineering'),
        ('Finance'),
        ('Legal'),
        ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES  ('CEO', 10000000, 1),
        ('Recruiter', 80000, 1),
        ('Software Engineer', 120000, 2),
        ('Accountant', 85000, 3),
        ('Finance Manager', 120000, 3),
        ('Legal Assistant', 75000, 4),
        ('Lawyer', 120000, 4),
        ('Salesperson', 80000, 5),
        ('Sales Manager', 120000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, 1),
       ('Alice', 'Williams', 3, 1),
       ('Bob', 'Jones', 4, 3),
       ('Charlie', 'Brown', 5, 3),
       ('Dora', 'Johnson', 6, 4),
       ('Eve', 'Wilson', 7, 4),
       ('Frank', 'Thomas', 8, 5),
       ('Grace', 'Moore', 9, 5);