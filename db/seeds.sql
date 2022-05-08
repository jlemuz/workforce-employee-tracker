INSERT INTO department (name)
VALUES
 ('SALES'),
 ('ENGINEERING'),
 ('FINANCE'),
 ('LEGAL');

 INSERT INTO role (title, salary, department_id)
 VALUES
 ('Salesperson', 88000, 1),
 ('Lead Engineer', 150000, 2),
 ('Software Engineer', 150000, 2),
 ('Account Manager', 160000, 3),
 ('Accountant', 125000, 3),
 ('Legal Team Lead', 250000, 4),
 ('Lawyer', 190000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, NULL),
  ('Virginia', 'Woolf', 2, 1),
  ('Piers', 'Gaveston', 3, 2),
  ('Charles', 'LeRoi', 4, 1),
  ('Katherine', 'Mansfield', 5, 1),
  ('Dora', 'Carrington', 2, 3),
  ('Edward', 'Bellamy', 4, 3),
  ('Montague', 'Summers', 5, 1),
  ('Octavia', 'Butler', 5, 1),
  ('Unica', 'Zurn', 5, 1);