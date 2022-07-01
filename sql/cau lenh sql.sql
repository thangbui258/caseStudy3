create database QuanLyHS;
use QuanLyHS;

--tao bang UserLogin
create table UserLogin (
	Name varchar(40) not null,
    Email varchar(60) not null unique primary key,
    Pass varchar(16) not null
);
alter table UserLogin add Roll varchar(10) not null;
--tao bang danh sach hoc sinh
create table DanhSachHS (
	ID_HS int(4) not null auto_increment primary key,
    Name varchar(40) not null,
    Email varchar(60) not null unique,
    Phone int(10) not null
    );
    
--tao bang danh sach mon hoc
create table Subject (
	ID_subject int(2) not null auto_increment primary key,
    Subject varchar(26) not null
);

--tao bang ket qua
create table KetQua (
	ID_HS int(4) not null,
    ID_subject int(2) not null,
    Score int(2),
    primary key(ID_HS,ID_subject),
    foreign key (ID_HS) references DanhSachHS(ID_HS),
    foreign key (ID_subject) references Subject(ID_subject)
);

--tao ban ghi Userlogin
 insert into UserLogin (Name,Email,Pass,Roll) values ('admin', 'admin@gmail.com',123,'admin');
 insert into UserLogin (Name,Email,Pass,Roll) values ('thang', 'thang@gmail.com',123,'member');

 insert into DanhSachHS (Name,Email,Phone) values ('Nam', 'nam@gmail.com',1234567890);
 insert into DanhSachHS (Name,Email,Phone) values ('Tai', 'Tai@gmail.com',1234567890);
 
 insert into Subject (Subject) values ('Toan');
 insert into Subject (Subject) values ('Van');
 insert into Subject (Subject) values ('Anh');
 
delimiter //
CREATE PROCEDURE delete_list_student (IN id INT)
  BEGIN
    delete from KetQua where ID_HS = id;
	delete from DanhSachHS where ID_HS = id;
  END//
delimiter ; 
CALL delete_list_student(2);

delimiter //
CREATE PROCEDURE update_Score (scoreT INT,
								scoreV INT,
                                scoreA INT,
                                id INT
)
  BEGIN
    update KetQua set Score = scoreT where ID_HS = id && ID_subject = 1; 
    update KetQua set Score = scoreV where ID_HS = id && ID_subject = 2; 
    update KetQua set Score = scoreA where ID_HS = id && ID_subject = 3; 
  END//
delimiter ;

call update_Score ('1',1,1,5);

select DanhSachHS.ID_HS, DanhSachHS.Name, Subject.Subject, KetQua.Score
from KetQua
inner join DanhSachHS on KetQua.ID_HS = DanhSachHS.ID_HS
inner join Subject on KetQua.ID_subject = Subject.ID_subject;

select DanhSachHS.Name, KetQua.ID_HS, KetQua.Score
                        from KetQua
                        inner join DanhSachHS on KetQua.ID_HS = DanhSachHS.ID_HS 
                        where KetQua.ID_HS = 5;
