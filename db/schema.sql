#MYSQL SCHEMA GOES HERE
CREATE DATABASE anagram_db;

USE anagram_db;

CREATE TABLE anagram_db.player (
	playerId INTEGER ( 10 ) AUTO_INCREMENT NOT NULL,
	playerNumbr INTEGER ( 10 ),
	playerName VARCHAR ( 255 ),
	playerScore INTEGER ( 10 ),
	PRIMARY KEY (playerId));

CREATE TABLE anagram_db.game (
	gameId INTEGER ( 11 ) AUTO_INCREMENT NOT NULL,
	gameDesc VARCHAR ( 120 ),
	gameStartTime TIMESTAMP,
	gameEndtTime TIMESTAMP,
	gameTimeLimit INTEGER ( 10),
	PRIMARY KEY (gameId));