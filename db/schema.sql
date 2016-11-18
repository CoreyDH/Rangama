#MYSQL SCHEMA GOES HERE
CREATE DATABASE anagram_db;

USE anagram_db;

CREATE TABLE `word` (
	id INTEGER( 11 ) AUTO_INCREMENT NOT NULL,
    word VARCHAR ( 255 ) NOT NULL,
	threeLetters VARCHAR( 255) NOT NULL,
	fourLetters VARCHAR( 255) NOT NULL,
	fiveLetters VARCHAR( 255) NOT NULL,
		PRIMARY KEY ( id ) );

CREATE TABLE anagram_db.player (
	playerId INTEGER ( 10 ) AUTO_INCREMENT NOT NULL,
	playerName VARCHAR ( 255 ),
	playerScore INTEGER ( 10 ),
	PRIMARY KEY (playerId));

CREATE TABLE anagram_db.game (
	gameId INTEGER ( 11 ) AUTO_INCREMENT NOT NULL,
	gameDesc VARCHAR ( 120 ),
	gameTimeLimit INTEGER ( 10),
	PRIMARY KEY (gameId));

CREATE TABLE anagram_db.top_score (
	topScoreId INTEGER ( 10 ) AUTO_INCREMENT NOT NULL,
	playerName VARCHAR ( 255 ),
	topScore INTEGER ( 10 ),
	
	PRIMARY KEY (topScoreId));
