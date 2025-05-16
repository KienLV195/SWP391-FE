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
(CAST('Kien@gmail.com' AS VARBINARY), '$2a$12$Mv6D5ra.ZkrM2jSnpzGj9.3U7ADHtC9YO8opNB2lGp9dov13hzUSe', CAST('Kien' AS VARBINARY), 25, CAST('0123456789' AS VARBINARY), CAST('126 Hoang Hoa Tham HCM' AS VARBINARY), 1, 'A', 'Rh+', 2),
(CAST('Nhu@gmail.com' AS VARBINARY), '$2a$12$6nDP7npwCjx3Bfyd.3mJk.xcVHZP5uxK.A7UnZMxIFDNhzLzQqlbO', CAST('Nhu' AS VARBINARY), 30, CAST('0987654321' AS VARBINARY), CAST('473 Le Van Si HCM' AS VARBINARY), 1, 'B', 'Rh-', 2),
(CAST('Vinh@gmail.com' AS VARBINARY), '$2a$12$FNdkgcsRyo4IB3rQG4kxSevG.gRZ3wYtuUXRCgHlODPXdzRw69s4C', CAST('Vinh' AS VARBINARY), 22, CAST('0909090909' AS VARBINARY), CAST('521 Dong Khoi HCM' AS VARBINARY), 1, 'O', 'Rh+', 3),
(CAST('Duc@gmail.com' AS VARBINARY), '$2a$12$5yB4taC2nkAVqzUZ5dnRMu4MTUNWvtsF9sIUo/NY2Rvzy5uOyMp9y', CAST('Duc' AS VARBINARY), 35, CAST('0933933933' AS VARBINARY), CAST('435 Le Van Viet' AS VARBINARY), 1, 'AB', 'Rh-', 3),
(CAST('Nhi@gmail.com' AS VARBINARY), '$2a$12$z7EY9UAtu3iQrIptwWw9Tuo2qS1hF1EQiZr0rXlDUv9kuoWJFFAoK', CAST('Nhi' AS VARBINARY), 28, CAST('0911223344' AS VARBINARY), CAST('726 Thong Nhat HCM' AS VARBINARY), 1, 'O', 'Rh+', 1);
GO

INSERT INTO Facilities (Name, Address, Email, Phone, Latitude, Longitude)
VALUES
(N'Bệnh viện Chợ Rẫy', N'201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM', 'bvchoray@choray.vn', '02838554137', 10.7556, 106.6639),
(N'Bệnh viện Nhân dân Gia Định', N'1 Nơ Trang Long, Phường 7, Bình Thạnh, TP.HCM', 'bvgd@hcmhealth.gov.vn', '02838412617', 10.8031, 106.6945),
(N'Bệnh viện Đại học Y Dược TP.HCM', N'215 Hồng Bàng, Phường 11, Quận 5, TP.HCM', 'contact@umc.edu.vn', '02838554269', 10.7585, 106.6646),
(N'Bệnh viện Nhi Đồng 1', N'341 Sư Vạn Hạnh, Phường 10, Quận 10, TP.HCM', 'bvnd1@hcmhealth.gov.vn', '02839271119', 10.7723, 106.6675),
(N'Bệnh viện Từ Dũ', N'284 Cống Quỳnh, Phường Phạm Ngũ Lão, Quận 1, TP.HCM', 'tudu@tudu.com.vn', '02838391747', 10.7631, 106.6897),
(N'Bệnh viện Quốc tế Vinmec Central Park', N'208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP.HCM', 'info@vinmec.com', '02835203388', 10.7945, 106.7206),
(N'Bệnh viện Quốc tế Pháp Việt (FV Hospital)', N'6 Nguyễn Lương Bằng, Phường Tân Phú, Quận 7, TP.HCM', 'information@fvhospital.com', '02854113333', 10.7306, 106.7217),
(N'Bệnh viện Quân y 175', N'786 Nguyễn Kiệm, Phường 3, Gò Vấp, TP.HCM', 'bv175@bv175.vn', '02838940063', 10.8231, 106.6875),
(N'Bệnh viện Hùng Vương', N'128 Hồng Bàng, Phường 12, Quận 5, TP.HCM', 'info@bvhungvuong.vn', '02838554126', 10.7551, 106.6590),
(N'Bệnh viện Nhân dân 115', N'527 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM', 'bv115@hcmhealth.gov.vn', '02838653239', 10.7769, 106.6672),
(N'Bệnh viện Nhiệt Đới TP.HCM', N'764 Võ Văn Kiệt, Phường 1, Quận 5, TP.HCM', 'bv.bnhietdoi@tphcm.gov.vn', '02839238704', 10.7521, 106.6632),
(N'Bệnh viện Hoàn Mỹ Sài Gòn', N'60-60A Phan Xích Long, Phường 1, Phú Nhuận, TP.HCM', 'contactus.saigon@hoanmy.com', '02839902468', 10.7995, 106.6816),
(N'Bệnh viện Truyền máu Huyết học TP.HCM', N'118 Hồng Bàng, Phường 12, Quận 5, TP.HCM', 'contact@bvtmhh.gov.vn', '02839557858', 10.7592, 106.6557),
(N'Bệnh viện Quân dân y miền Đông', N'50 Lê Văn Việt, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM', 'info@bvqdymd.vn', '02838966764', 10.8474, 106.7893),
(N'Bệnh viện Quốc tế Mỹ (AIH)', N'199 Nguyễn Hoàng, Phường An Phú, Quận 2, TP.HCM', 'info@aih.com.vn', '02839109100', 10.8002, 106.7468);
GO

INSERT INTO BloodArticles (Title, Content, img_url)
VALUES
('Giới thiệu các nhóm máu', 'Hệ thống nhóm máu ABO chia máu người thành 4 nhóm chính:

Nhóm máu A: có kháng nguyên A trên bề mặt hồng cầu và kháng thể anti-B trong huyết tương.

Nhóm máu B: có kháng nguyên B và kháng thể anti-A.

Nhóm máu AB: có cả kháng nguyên A và B, không có kháng thể. Là người nhận phổ thông.

Nhóm máu O: không có kháng nguyên, có cả kháng thể anti-A và anti-B. Là người cho phổ thông.

Ngoài ABO còn có yếu tố Rh (Rh+ hoặc Rh-), nhưng trong tài liệu này tập trung vào hệ ABO.', 'article1.jpg'),
('Nguyên tắc truyền máu toàn phần', 'Truyền máu toàn phần là việc truyền nguyên đơn vị máu, bao gồm hồng cầu, huyết tương, tiểu cầu và bạch cầu.

Nguyên tắc quan trọng: Tránh sự tương tác giữa kháng nguyên trên hồng cầu của người cho và kháng thể trong huyết tương của người nhận.

Tương thích nhóm máu toàn phần:

Người nhóm O → cho được tất cả (cho phổ thông)

Người nhóm AB → nhận được từ tất cả (nhận phổ thông)

Bảng tương thích:

Nhóm O nhận từ: O

Nhóm A nhận từ: A, O

Nhóm B nhận từ: B, O

Nhóm AB nhận từ: AB, A, B, O', 'article2.jpg'),
('Truyền hồng cầu', 'Truyền hồng cầu tập trung vào tương tác giữa kháng nguyên trên hồng cầu và kháng thể trong huyết tương người nhận. Nguyên tắc tương tự truyền máu toàn phần.

Bảng tương thích hồng cầu:

Người nhóm O nhận từ: O

Người nhóm A nhận từ: A, O

Người nhóm B nhận từ: B, O

Người nhóm AB nhận từ: A, B, AB, O

Người cho hồng cầu phổ thông: O', 'article3.jpg'),
('Truyền huyết tương', 'Huyết tương chứa các kháng thể, không chứa kháng nguyên. Khi truyền huyết tương, cần tránh kháng thể của người cho tấn công hồng cầu của người nhận.

Người nhóm AB không có kháng thể → là người cho huyết tương phổ thông.

Bảng tương thích huyết tương:

Nhóm O nhận từ: O, A, B, AB

Nhóm A nhận từ: A, AB

Nhóm B nhận từ: B, AB

Nhóm AB nhận từ: AB', 'article4.jpg'),
('Truyền tiểu cầu', 'Tiểu cầu có ít biểu hiện kháng nguyên ABO, do đó việc truyền có thể linh hoạt hơn. Tuy nhiên, trong trường hợp có thời gian và nguồn lực, vẫn nên truyền cùng nhóm để hạn chế phản ứng miễn dịch.

Gợi ý:

Truyền cùng nhóm là tốt nhất

Truyền chéo có thể chấp nhận trong cấp cứu nếu kiểm soát cẩn thận', 'article5.jpg'),
('Tổng quan về các loại thành phần máu','Máu người gồm nhiều thành phần:

Hồng cầu: mang oxy, chứa kháng nguyên nhóm máu.

Huyết tương: là phần lỏng, chứa kháng thể và protein.

Tiểu cầu: giúp đông máu.

Bạch cầu: chống nhiễm trùng, không liên quan đến truyền máu thông thường.

Tùy vào bệnh lý, bác sĩ có thể chỉ định truyền toàn phần hoặc từng thành phần riêng biệt.','article6.jpg'),
('Ý nghĩa truyền máu chọn lọc thành phần','Truyền máu theo thành phần giúp:

Giảm nguy cơ phản ứng miễn dịch

Tối ưu hiệu quả điều trị

Sử dụng hợp lý nguồn máu hiến

Ví dụ:

Thiếu máu nặng → truyền hồng cầu

Rối loạn đông máu → truyền huyết tương hoặc tiểu cầu','article7.jpg');
GO

INSERT INTO BlogPosts (Title, Content, img_url, UserID, Posted)
VALUES
(N'Lần đầu tôi hiến máu', 
N'Lần đầu tiên tôi hiến máu là một trải nghiệm vừa hồi hộp vừa đầy ý nghĩa. Tôi bước vào trung tâm hiến máu mà không biết điều gì sẽ xảy ra. Các y tá rất thân thiện, giải thích quy trình rõ ràng. Tôi ngạc nhiên vì quá trình này diễn ra rất nhanh và hầu như không đau. Sau khi hiến xong, tôi ngồi nghỉ với một hộp nước trái cây và bánh quy, cảm thấy rất tự hào vì biết rằng mình có thể đã giúp cứu sống một ai đó. Hành động tuy nhỏ nhưng đã thay đổi suy nghĩ của tôi. Tôi bắt đầu tìm hiểu về tình trạng thiếu máu, đặc biệt là vào các dịp lễ và biết rằng một lần hiến máu có thể giúp được đến ba người. Từ đó, tôi quyết định hiến máu định kỳ mỗi 6 tháng và còn rủ bạn bè cùng tham gia.', 
'blog1.jpg', 2, GETDATE()),

(N'Giúp đỡ trong khủng hoảng',
N'Khi đại dịch lên đến đỉnh điểm, các bệnh viện thiếu trầm trọng máu dự trữ. Tôi cảm thấy bất lực khi xem tin tức, nhưng tôi biết mình có thể làm gì đó. Tôi đã đặt lịch đến trung tâm hiến máu gần nhất. Mọi thứ được thực hiện theo quy định an toàn nghiêm ngặt, và tôi cảm thấy rất yên tâm. Việc hiến máu giúp tôi cảm thấy mình đang làm điều có ích, một cách để góp phần cứu sống người khác trong lúc khó khăn. Từ đó, tôi trở thành người hiến máu thường xuyên và còn đi tuyên truyền ở các nhóm sinh viên để nâng cao nhận thức. Một hành động nhỏ thôi nhưng có thể tạo ra sự thay đổi rất lớn.',
'blog2.jpg', 3, GETDATE()),

(N'Tại sao tôi chọn hiến máu',
N'Nhiều người hỏi tôi vì sao lại đi hiến máu thường xuyên. Câu trả lời rất đơn giản: vì tôi có thể, và vì nó cứu sống con người. Có rất nhiều trường hợp bệnh nhân cần máu gấp như phẫu thuật, tai nạn, điều trị ung thư... Nếu không có người hiến, họ có thể không qua khỏi. Tôi chưa từng phải truyền máu, nhưng tôi biết nhiều người đã từng, và họ sống được là nhờ sự hy sinh thầm lặng của người khác. Quá trình hiến máu rất an toàn, nhanh chóng và có đội ngũ y tế hỗ trợ. Thậm chí sau khi hiến còn được ăn nhẹ và trò chuyện với những người tử tế khác. Mục tiêu của tôi là đạt 50 lần hiến máu trong đời.',
'blog3.jpg', 2, GETDATE()),

(N'Trải nghiệm tại trung tâm hiến máu',
N'Tôi từng lo lắng khi lần đầu bước vào trung tâm hiến máu. Liệu có đau không? Tôi có đủ điều kiện không? Nhưng nhân viên ở đó đã xóa tan mọi lo âu. Họ hướng dẫn tận tình, kiểm tra kỹ lưỡng và luôn mỉm cười khiến tôi cảm thấy rất thoải mái. Lúc chích kim vào cũng chỉ như một cú chích nhẹ, hoàn toàn chịu được. Sau đó tôi nghỉ ngơi một lúc và cảm thấy rất tự hào. Từ đó, tôi quay lại thường xuyên và thậm chí còn quen biết với những người hiến máu khác. Chúng tôi như một cộng đồng thầm lặng, luôn sẵn sàng giúp đỡ người cần. Tôi khuyên mọi người hãy thử một lần. Bạn sẽ ngạc nhiên với cảm giác tuyệt vời đó.',
'blog4.jpg', 3, GETDATE()),

(N'Hành trình hiến máu của tôi',
N'Tôi bắt đầu hành trình hiến máu khi một người bạn thân bị tai nạn và cần truyền máu gấp. Khoảnh khắc đó thay đổi tôi. Tôi lập tức đến hiến máu và kể từ đó không ngừng lại. Mỗi lần hiến, tôi lại nhớ tới bạn mình và nghĩ đến những người đang cần. Tôi từng đọc các câu chuyện về trẻ sinh non, bệnh nhân ung thư hay những người có nhóm máu hiếm được cứu sống nhờ máu của người lạ. Điều đó khiến tôi thấy mình thật nhỏ bé nhưng lại có thể làm điều lớn lao. Giờ tôi ghi chép lại mỗi lần hiến máu và đặt lịch định kỳ 3 tháng một lần. Nó đã trở thành một phần cuộc sống của tôi. Lời nhắn của tôi đến bạn là: Đừng chờ tới khi có chuyện xấu mới hành động. Hãy là người giúp đỡ từ hôm nay.',
'blog5.jpg', 2, GETDATE());
GO

INSERT INTO BloodInventory (FacilityID, BloodGroup, RhType, ComponentType, Quantity, LastUpdated)
VALUES
(1, 'A', 'Rh+', 'Plasma', 10, GETDATE()),
(1, 'O', 'Rh-', 'Whole Blood', 5, GETDATE()),
(2, 'B', 'Rh+', 'Platelets', 7, GETDATE()),
(2, 'AB', 'Rh-', 'Red Cells', 3, GETDATE()),
(3, 'O', 'Rh+', 'Whole Blood', 8, GETDATE());
GO

INSERT INTO BloodRequests (UserID, BloodGroup, RhType, BloodComponent, Quantity, UrgencyLevel, NeededTime, Reason, Status, CreatedTime)
VALUES
(1, 'A', 'Rh+', 'Plasma', 2, 'High', DATEADD(DAY, 1, GETDATE()), 'Surgery', 0, GETDATE()),
(2, 'O', 'Rh-', 'Whole Blood', 1, 'Medium', DATEADD(DAY, 2, GETDATE()), 'Accident', 0, GETDATE()),
(3, 'B', 'Rh+', 'Platelets', 3, 'Low', DATEADD(DAY, 3, GETDATE()), 'Cancer treatment', 1, GETDATE()),
(4, 'AB', 'Rh-', 'Red Cells', 2, 'High', DATEADD(DAY, 1, GETDATE()), 'Emergency', 2, GETDATE()),
(5, 'O', 'Rh+', 'Whole Blood', 1, 'Medium', DATEADD(DAY, 2, GETDATE()), 'Anemia', 0, GETDATE());
GO

INSERT INTO BloodRequestHistory (UserID, RequestID, Status, TimeStamp)
VALUES
(1, 1, 'Requested', GETDATE()),
(2, 2, 'Requested', GETDATE()),
(3, 3, 'Accepted', GETDATE()),
(4, 4, 'Completed', GETDATE()),
(5, 5, 'Requested', GETDATE());
GO

INSERT INTO BloodDonationHistory (UserID, FacilityID, DonationDate, BloodGroup, RhType, ComponentType, Quantity, Notes)
VALUES
(1, 1, GETDATE(), 'A', 'Rh+', 'Plasma', 1, 'Routine donation'),
(2, 2, GETDATE(), 'O', 'Rh-', 'Whole Blood', 1, 'After 6 months'),
(3, 1, GETDATE(), 'B', 'Rh+', 'Platelets', 1, 'First time donor'),
(4, 3, GETDATE(), 'AB', 'Rh-', 'Red Cells', 1, 'Voluntary'),
(5, 2, GETDATE(), 'O', 'Rh+', 'Whole Blood', 1, 'No issues');
GO

INSERT INTO Notifications (UserID, Title, Message, IsRead, SENT)
VALUES
(1, 'Donation Reminder', 'You can donate again in 2 weeks', 0, GETDATE()),
(2, 'Urgent Request', 'We need your blood type urgently', 0, GETDATE()),
(3, 'Thank You', 'Thanks for donating!', 1, GETDATE()),
(4, 'Blood Request Approved', 'Your request has been approved', 1, GETDATE()),
(5, 'New Article', 'Check out our latest blood donation guide', 0, GETDATE());
GO