-- CREATE DATABASE sonagb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- CREATE USER 'sonagb'@'%' IDENTIFIED BY 'PASSWORD';
-- GRANT ALL PRIVILEGES ON sonagb.* TO 'sonagb'@'%' WITH GRANT OPTION;
CREATE TABLE
  `sonagb`.`account` (
    `seq` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(160) NOT NULL UNIQUE,
    `name` VARCHAR(80) NOT NULL,
    `alias` VARCHAR(80) NOT NULL UNIQUE,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`seq`)
  );

CREATE TABLE
  `sonagb`.`library` (
    `seq` INT NOT NULL AUTO_INCREMENT,
    `accountSeq` INT NOT NULL,
    `isbn` VARCHAR(80) NOT NULL UNIQUE,
    `title` VARCHAR(250) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`seq`)
  );

ALTER TABLE `sonagb`.`library`
	ADD UNIQUE`library_accountSeq_isbn` (`accountSeq`, `isbn`);

CREATE TABLE
  `sonagb`.`stage` (
    `seq` INT NOT NULL AUTO_INCREMENT,
    `accountSeq` INT NOT NULL,
    `name` VARCHAR(80) NOT NULL UNIQUE,
    `data` TEXT NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`seq`)
  );

CREATE TABLE
  `sonagb`.`scoreboard` (
    `seq` INT NOT NULL AUTO_INCREMENT,
    `stageSeq` INT NOT NULL,
    `accountSeq` INT NOT NULL,
    `score` INT NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`seq`)
  );

ALTER TABLE `sonagb`.`scoreboard`
	ADD INDEX `scoreboard_score_stageSeq` (`score` DESC, `stageSeq` DESC);

ALTER TABLE `sonagb`.`scoreboard`
	ADD INDEX `scoreboard_stageSeq_score` (`stageSeq` DESC, `score` DESC);
