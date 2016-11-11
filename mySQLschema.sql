CREATE 'rangama_db';

USE 'rangama_db';

CREATE TABLE `anagram` (
	id INTEGER( 11 ) AUTO_INCREMENT NOT NULL,
	userName VARCHAR( 255) NOT NULL,
	score INTEGER( 11 ) NOT NULL,
	diffLevel VARCHAR( 255 ) NOT NULL,
	bestWord VARCHAR( 255 ) NOT NULL,
    dateti DATETIME NOT NULL,
	highestLevel Int(11) NOT NULL,
	PRIMARY KEY ( id ) );