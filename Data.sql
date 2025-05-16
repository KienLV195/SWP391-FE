USE BloodManagementSystem
Go

INSERT INTO Roles (RoleName)
VALUES 
('Admin'),
('Member'),
('Staff');
GO

INSERT INTO Users (Email, PasswordHash, Name, Age, Phone, Address, Status, BloodGroup, RhType, RoleID)
VALUES
(CAST('Kien@gmail.com' AS VARBINARY), '$2a$12$abcdef...', CAST('Kien' AS VARBINARY), 25, CAST('0123456789' AS VARBINARY), CAST('126 Hoang Hoa Tham HCM' AS VARBINARY), 1, 'A', 'Rh+', 2),
(CAST('Nhu@gmail.com' AS VARBINARY), '$2a$12$abcdef...', CAST('Nhu' AS VARBINARY), 30, CAST('0987654321' AS VARBINARY), CAST('473 Le Van Si HCM' AS VARBINARY), 1, 'B', 'Rh-', 2),
(CAST('Vinh@gmail.com' AS VARBINARY), '$2a$12$abcdef...', CAST('Vinh' AS VARBINARY), 22, CAST('0909090909' AS VARBINARY), CAST('521 Dong Khoi HCM' AS VARBINARY), 1, 'O', 'Rh+', 3),
(CAST('Duc@gmail.com' AS VARBINARY), '$2a$12$abcdef...', CAST('Duc' AS VARBINARY), 35, CAST('0933933933' AS VARBINARY), CAST('435 Le Van Viet' AS VARBINARY), 1, 'AB', 'Rh-', 3),
(CAST('Nhi@gmail.com' AS VARBINARY), '$2a$12$abcdef...', CAST('Nhi' AS VARBINARY), 28, CAST('0911223344' AS VARBINARY), CAST('726 Thong Nhat HCM' AS VARBINARY), 1, 'O', 'Rh+', 1);
GO