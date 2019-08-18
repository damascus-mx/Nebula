/**
 * @name Nebula for Andromeda
 * @version 0.0.1a
 * @copyright Damascus. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus IT intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Main Nebula/Andromeda SQL Script
 */
 
-- Create schemas
CREATE SCHEMA IF NOT EXISTS client;
CREATE SCHEMA IF NOT EXISTS enterprise;

-- User table
CREATE TABLE client.users (
	ID BIGSERIAL PRIMARY KEY NOT NULL,
	USERNAME VARCHAR(50) NOT NULL UNIQUE,
	PASSWORD VARCHAR(255) NOT NULL,
	EMAIL VARCHAR(255) NOT NULL UNIQUE,
	NAME VARCHAR(100) NOT NULL,
	SURNAME VARCHAR(100) NOT NULL,
	IMAGE VARCHAR(255),
	COVER VARCHAR(255),
	BIO TEXT,
	TOTAL_FOLLOWERS BIGINT,
	PHONE BIGINT UNIQUE,
	LOCATION VARCHAR(255),
	CITY VARCHAR(255),
	COUNTRY VARCHAR(10) NOT NULL,
	THEME_HEX VARCHAR(50),
	ROLE VARCHAR(50) NOT NULL,
	PRIVATE BOOL DEFAULT TRUE,
	VERIFIED BOOL,
	CONFIRMED BOOL,
	ACTIVE BOOL,
	CREATED_AT DATE NOT NULL DEFAULT CURRENT_DATE,
	UPDATED_AT DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Insert fake user data
INSERT INTO client.users (USERNAME, PASSWORD, EMAIL, NAME, SURNAME, BIO, TOTAL_FOLLOWERS, PHONE, CITY, COUNTRY, THEME_HEX, CREATED_AT, ROLE,
				  PRIVATE, VERIFIED, CONFIRMED, ACTIVE) 
VALUES (
	'aruizmx', 'caca123', 'luis.alonso.16@hotmail.com', 'Alonso', 'R', 'Entrepreneur', 
	1452690, 526141592623, 'Chihuahua', 'MX', '01579b', '2019-06-01', 'ROLE_ADMIN', FALSE, TRUE,
	TRUE, TRUE
), (
	'hiramuzl', 'caca123', 'hiram.feo@outlook.com', 'Hiram', 'Muñoz', 'Dentista esclavo', 
	2574, 521845816, 'Las Vegas', 'US', '00bfa5', '2019-08-01', 'ROLE_USER', TRUE, FALSE,
	TRUE, TRUE
), (
	'br1arevalo', 'caca10', 'el.bruno@hotmail.com', 'Bruno', 'Arevalo', 'Love cats <3', 
	2580, 526148526932, 'Chihuahua', 'MX', '01579b', '2019-07-09', 'ROLE_SUPPORT', TRUE, FALSE,
	TRUE, TRUE
), (
	'checheriv', 'caca10', 'jose.rivera69@outlook.com', 'Jose', 'Rivera', 'Viernes de ahorcar rucas', 
	9852465, 526145236987, 'Mexico City', 'MX', '00bfa5', '2019-01-30', 'ROLE_USER', FALSE, TRUE,
	FALSE, TRUE
);

-- Followers table
CREATE TABLE client.user_followers (
	FK_USER BIGSERIAL NOT NULL REFERENCES CLIENT.USERS(ID),
	FK_FOLLOWER BIGSERIAL NOT NULL REFERENCES CLIENT.USERS(ID)
);

-- Insert fake follower data
INSERT INTO client.user_followers VALUES (1, 2), (1,3), (1, 4), (4, 2), (2, 3);

-- Joins example
SELECT A.USERNAME, A.ID FROM client.users AS A INNER JOIN client.user_followers AS B ON A.ID = B.FK_USER OR A.ID = B.FK_FOLLOWER;
SELECT B.USERNAME, A.FK_FOLLOWER FROM client.user_followers AS A LEFT JOIN client.users AS B ON A.FK_USER = B.ID;

-- Chat groups table
CREATE TABLE client.chats (
	ID BIGSERIAL PRIMARY KEY NOT NULL,
	IAT DATE DEFAULT CURRENT_DATE,
	TOTAL_MSG BIGINT
);

-- Messages inside chat
CREATE TABLE client.messages (
	ID BIGSERIAL PRIMARY KEY NOT NULL,
	FK_RECEIVER BIGSERIAL NOT NULL REFERENCES CLIENT.USERS(ID),
	FK_SENDER BIGSERIAL NOT NULL REFERENCES CLIENT.USERS(ID),
	CONTENT TEXT NOT NULL,
	IAT DATE DEFAULT CURRENT_DATE,
	READ BOOL,
	FK_CHAT BIGSERIAL NOT NULL REFERENCES CLIENT.CHATS(ID)
);

-- Company table
CREATE TABLE enterprise.company (
	ID BIGSERIAL PRIMARY KEY NOT NULL,
	NAME VARCHAR(255) NOT NULL,
	DESCRIPTION VARCHAR(255),
	COUNTRY VARCHAR(10) NOT NULL,
	PHONE BIGINT
);

-- Place table within company
CREATE TABLE client.place (
	ID BIGSERIAL PRIMARY KEY NOT NULL,
	NAME VARCHAR(255) NOT NULL,
	USERNAME VARCHAR(50) NOT NULL UNIQUE,
	EMAIL VARCHAR(255),
	PHONE BIGINT,
	BIO TEXT,
	WEBSITE VARCHAR(255),
	IMAGE VARCHAR(255),
	COVER VARCHAR(255),
	TOTAL_FOLLOWERS BIGINT,
	COVER_CHARGE REAL DEFAULT 0.0,
	LOCATION VARCHAR(255),
	CITY VARCHAR(255),
	COUNTRY VARCHAR(10) NOT NULL,
	THEME_HEX VARCHAR(50),
	FK_COMPANY BIGSERIAL NOT NULL REFERENCES ENTERPRISE.COMPANY(ID),
	LOCK_STOCK BOOL,
	VERIFIED BOOL,
	ACTIVE BOOL,
	CREATED_AT DATE NOT NULL DEFAULT CURRENT_DATE,
	UPDATED_AT DATE DEFAULT CURRENT_DATE
);


/*
* PROCEDURES
*/
-- User procedures / functions
CREATE OR REPLACE PROCEDURE client.create_user(_USERNAME VARCHAR, _PASSWORD VARCHAR, _EMAIL VARCHAR, _NAME VARCHAR, _SURNAME VARCHAR, _BIO VARCHAR,
							  _PHONE BIGINT, _CITY VARCHAR, _COUNTRY VARCHAR, _THEME_HEX VARCHAR, _IAT DATE, _ROLE VARCHAR) 
LANGUAGE plpgsql
AS $$
BEGIN
	INSERT INTO client.users (USERNAME, PASSWORD, EMAIL, NAME, SURNAME, BIO, PHONE, CITY, COUNTRY, THEME_HEX, IAT, ROLE,
					  PRIVATE, VERIFIED, CONFIRMED, ACTIVE) 
	VALUES (
		_USERNAME, _PASSWORD, _EMAIL, _NAME, _SURNAME, _BIO, 
		_PHONE, _CITY, _COUNTRY, _THEME_HEX, _IAT, _ROLE, TRUE, FALSE,
		FALSE, TRUE
	);
	COMMIT;
END;
$$;

CREATE OR REPLACE FUNCTION client.get_user(bigint)
RETURNS SETOF client.users AS $$
	SELECT * FROM client.users WHERE id = $1;
$$
LANGUAGE SQL;

SELECT * FROM client.get_user(1);

CREATE OR REPLACE FUNCTION client.user_by_followers()
RETURNS SETOF client.users AS $$
	SELECT * FROM client.users ORDER BY TOTAL_FOLLOWERS DESC LIMIT 100;
$$
LANGUAGE SQL;

SELECT * FROM client.user_by_followers();
