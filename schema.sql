-- CREATE DATABASE sonagb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- CREATE USER 'sonagb'@'%' IDENTIFIED BY 'PASSWORD';
-- GRANT ALL PRIVILEGES ON sonagb.* TO 'sonagb'@'%' WITH GRANT OPTION;
CREATE TABLE
  `sonagb`.`hello` (
    `seq` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL UNIQUE,
    PRIMARY KEY (`seq`)
  );
  
CREATE TABLE
  `sonagb`.`stage` (
    `seq` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL UNIQUE,
    `data` TEXT NOT NULL,
    PRIMARY KEY (`seq`)
  );
  
CREATE TABLE
  `sonagb`.`scoreboard` (
    `seq` INT NOT NULL AUTO_INCREMENT,
    `stageSeq` INT NOT NULL,
    `userName` VARCHAR(80) NOT NULL,
    `score` INT NOT NULL,
    PRIMARY KEY (`seq`)
  );

ALTER TABLE `sonagb`.`scoreboard`
	ADD INDEX `scoreboard_stageScore` (`stageSeq` ASC, `score` DESC);