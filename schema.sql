-- CREATE DATABASE sonagb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- CREATE USER 'sonagb'@'%' IDENTIFIED BY 'PASSWORD';
-- GRANT ALL PRIVILEGES ON sonagb.* TO 'sonagb'@'%' WITH GRANT OPTION;
CREATE TABLE
  `sonagb`.`account` (
    `seq` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(160) NOT NULL UNIQUE,
    `name` VARCHAR(80) NOT NULL,
    PRIMARY KEY (`seq`)
  );
  
CREATE TABLE
  `sonagb`.`stage` (
    `seq` INT NOT NULL AUTO_INCREMENT,
    `accountSeq` INT NOT NULL,
    `name` VARCHAR(80) NOT NULL UNIQUE,
    `data` TEXT NOT NULL,
    PRIMARY KEY (`seq`)
  );
  
CREATE TABLE
  `sonagb`.`scoreboard` (
    `seq` INT NOT NULL AUTO_INCREMENT,
    `stageSeq` INT NOT NULL,
    `accountSeq` INT NOT NULL,
    `score` INT NOT NULL,
    PRIMARY KEY (`seq`)
  );

ALTER TABLE `sonagb`.`scoreboard`
	ADD INDEX `scoreboard_stageScore` (`score` DESC, `stageSeq` DESC);
