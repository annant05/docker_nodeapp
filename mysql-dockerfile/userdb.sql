CREATE DATABASE IF NOT EXISTS userdb;
USE userdb;
CREATE USER IF NOT EXISTS 'annant'@'%' IDENTIFIED WITH mysql_native_password BY '12345678';
CREATE TABLE IF NOT EXISTS userdb.users(email varchar(20) not null UNIQUE,password  varchar(20) not null);

