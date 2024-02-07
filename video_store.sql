drop database if exists video_store; 
create database video_store;
use video_store;

create table employee(
employee_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
employee_name varchar(255) NOT NULL,
age int NOT NULL,
address varchar(255) NOT NULL,
phoneNo bigint NOT NULL
);

create table customer(
cust_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
cust_name varchar(255) NOT NULL,
address varchar(255) NOT NULL,
age int NOT NULL,
phoneNo bigint NOT NULL
);

create table movie(
movie_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
movie_name varchar(255) NOT NULL,
rating varchar (255) NOT NULL,
genre varchar(255) NOT NULL,
release_year int NOT NULL
);

create table rental(
rent_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
rent_date varchar(255) NOT NULL,
return_date varchar(255) NOT NULL,
cost int NOT NULL,
cust_id int NOT NULL,
employee_id int NOT NULL,
movie_id int NOT NULL,
returned boolean,
FOREIGN KEY (cust_id) REFERENCES customer (cust_id) ON DELETE CASCADE,
FOREIGN KEY (employee_id) REFERENCES employee (employee_id) ON DELETE CASCADE,
FOREIGN KEY (movie_id) REFERENCES movie (movie_id) ON DELETE CASCADE
);