-- Tạo database
CREATE DATABASE BloodManagementSystem;
GO

USE BloodManagementSystem;
GO

-- Bảng Roles
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(6) -- VD: Admin, Member, Staff, Guest
);

-- Bảng Users (mã hóa AES/Bcrypt tại tầng ứng dụng)
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Email VARBINARY(MAX),         -- Mã hóa AES
    PasswordHash VARCHAR(255),    -- Hash bằng BCrypt.Net
    Name VARBINARY(MAX),          -- Mã hóa AES
    Age INT,
    Phone VARBINARY(MAX),         -- Mã hóa AES
    Address VARBINARY(MAX),       -- Mã hóa AES
    Status TINYINT,
    BloodGroup NVARCHAR(2),       -- A, B, AB, O
    RhType NVARCHAR(3),           -- Rh+, Rh-
    RoleID INT,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

-- Bảng Facilities
CREATE TABLE Facilities (
    FacilityID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255),
    Address NVARCHAR(255),
    Email NVARCHAR(255),
    Phone NVARCHAR(11),
    Latitude FLOAT,
    Longitude FLOAT
);

-- Bảng BloodArticles
CREATE TABLE BloodArticles (
    ArticleID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255),
    Content TEXT,
    img_url NVARCHAR(255)
);

-- Bảng BlogPosts
CREATE TABLE BlogPosts (
    PostID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255),
    Content TEXT,
    img_url NVARCHAR(255),
    UserID INT,
    Posted DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Bảng BloodInventory
CREATE TABLE BloodInventory (
    InventoryID INT PRIMARY KEY IDENTITY(1,1),
    FacilityID INT,
    BloodGroup NVARCHAR(2),
    RhType NVARCHAR(3),
    ComponentType NVARCHAR(20),
    Quantity INT,
    LastUpdated DATETIME,
    FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID)
);

-- Bảng BloodRequests
CREATE TABLE BloodRequests (
    RequestID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    BloodGroup NVARCHAR(2),
    RhType NVARCHAR(3),
    BloodComponent VARCHAR(1000),
    Quantity INT,
    UrgencyLevel VARCHAR(15),
    NeededTime DATETIME,
    Reason TEXT,
    Status TINYINT, -- 0: processing, 1: accepted, 2: complete
    CreatedTime DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Bảng BloodRequestHistory
CREATE TABLE BloodRequestHistory (
    HistoryID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    RequestID INT,
    Status VARCHAR(255),
    TimeStamp DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (RequestID) REFERENCES BloodRequests(RequestID)
);

-- Bảng BloodDonationHistory
CREATE TABLE BloodDonationHistory (
    DonationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    FacilityID INT,
    DonationDate DATETIME,
    BloodGroup NVARCHAR(2),
    RhType NVARCHAR(3),
    ComponentType NVARCHAR(20),
    Quantity INT,
    Notes NVARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID)
);

-- Bảng UserLocations (Chỉ lưu khi user cho phép, cập nhật liên tục hoặc tạm thời)
CREATE TABLE UserLocations (
    LocationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    Latitude FLOAT,
    Longitude FLOAT,
    UpdatedAt DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Bảng Notifications
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    Title NVARCHAR(255),
    Message TEXT,
    IsRead BIT,
    SENT DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
