#MYSQL SCHEMA GOES HERE
CREATE DATABASE word;

USE word;

CREATE TABLE word.game (
	gameId INTEGER ( 11 ) AUTO_INCREMENT NOT NULL,
	gameDesc VARCHAR ( 120 ),
	gameTimeLimit INTEGER ( 10 ),
	PRIMARY KEY (gameId));

CREATE TABLE word.words (
	id INTEGER( 11 ) AUTO_INCREMENT NOT NULL,
    word VARCHAR ( 255 ) NOT NULL,
	threeLetters VARCHAR( 255 ) NOT NULL,
	fourLetters VARCHAR( 255 ) NOT NULL,
	fiveLetters VARCHAR( 255 ) NOT NULL,
		PRIMARY KEY ( id ) );

CREATE TABLE word.player (
	playerId INTEGER ( 10 ) AUTO_INCREMENT NOT NULL,
	playerName VARCHAR ( 255 ),
	playerScore INTEGER ( 10 ),
	PRIMARY KEY (playerId));

CREATE TABLE word.top_score (
	topScoreId INTEGER ( 10 ) AUTO_INCREMENT NOT NULL,
	playerName VARCHAR ( 255 ),
	topScore INTEGER ( 10 ),
	PRIMARY KEY (topScoreId));

CREATE TABLE word.nimra (
	id Int( 11 ) AUTO_INCREMENT NOT NULL,
	item VARCHAR( 12) NOT NULL,
	key1 VARCHAR( 12 ),
	key2 VARCHAR( 12 ),
	key3 VARCHAR( 12 ),
	key4 VARCHAR( 12 ),
	key5 VARCHAR( 12 ),
	key6 VARCHAR( 12 ),
	key7 VARCHAR( 12 ),
	key8 VARCHAR( 12 ),
	key9 VARCHAR( 12 ),
	key10 VARCHAR( 12 ),
	key11 VARCHAR( 12 ),
	key12 VARCHAR( 12 ),
	key13 VARCHAR( 12 ),
	key14 VARCHAR( 12 ),
	key15 VARCHAR( 12 ),
	key16 VARCHAR( 12 ),
	key17 VARCHAR( 12 ),
	key18 VARCHAR( 12 ),
	key19 VARCHAR( 12 ),
	key20 VARCHAR( 12 ),
	key21 VARCHAR( 12 ),
	key22 VARCHAR( 12 ),
	key23 VARCHAR( 12 ),
	key24 VARCHAR( 12 ),
	key25 VARCHAR( 12 ),
	key26 VARCHAR( 12 ),
	key27 VARCHAR( 12 ),
	key28 VARCHAR( 12 ),
	key29 VARCHAR( 12 ),
	key30 VARCHAR( 12 ),	
	PRIMARY KEY ( id ));

