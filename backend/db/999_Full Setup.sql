CREATE SCHEMA `zmt` ;

CREATE TABLE `zmt`.`blog` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NULL,
  `author` VARCHAR(100) NULL,
  `preview` VARCHAR(1000) NULL,
  `content` LONGTEXT NULL,
  `date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `tag` VARCHAR(100) NULL DEFAULT 'Blogpost',
  `img` JSON NULL,
  `comment` VARCHAR(2000) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idblog_UNIQUE` (`id` ASC) VISIBLE);


CREATE TABLE `zmt`.`newsletter` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gender` VARCHAR(6) NOT NULL,
  `vorname` VARCHAR(200) NOT NULL,
  `nachname` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'All people who have registered for the newsletter are stored in this database table.';



CREATE TABLE `zmt`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(256) NULL,
  `password` VARCHAR(256) NULL,
  `name` VARCHAR(256) NULL,
  `family_name` VARCHAR(256) NULL,
  `email` VARCHAR(256) NULL,
  `picture` LONGTEXT NULL,
  `phone` VARCHAR(16) NULL DEFAULT '\"Keine Nummer\"',
  `type` VARCHAR(256) NULL DEFAULT '\"user\"',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);

ALTER TABLE `zmt`.`users` 
CHANGE COLUMN `picture` `picture` VARCHAR(512) NULL DEFAULT '\"/img/svg/personal.svg\"' ;

ALTER TABLE `zmt`.`users` 
ADD COLUMN `address` VARCHAR(512) NULL AFTER `type`;



CREATE TABLE `zmt`.`darkmode` (
  `user_id` INT NOT NULL,
  `darkmode` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE);




CREATE TABLE `zmt`.`news` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(2058) NOT NULL,
  `img_path` VARCHAR(1024) NOT NULL DEFAULT '/img/stock/echse.jpg',
  `img_alt` VARCHAR(2058) NOT NULL DEFAULT 'Eine Echse',
  `img_pos` VARCHAR(8) NOT NULL DEFAULT 'center',
  `btn` TINYINT NOT NULL DEFAULT 1,
  `btn_text` VARCHAR(16) NOT NULL DEFAULT 'Mehr Erfahren',
  `btn_link` VARCHAR(1024) NULL,
  `pdf` TINYINT NOT NULL DEFAULT 0,
  `pdf_src` VARCHAR(1024) NOT NULL DEFAULT 'error.pdf',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idadmin_UNIQUE` (`id` ASC) VISIBLE);



CREATE TABLE `zmt`.`gallery` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `author` VARCHAR(1000) NULL,
  `title` VARCHAR(256) NULL,
  `subtitle` VARCHAR(1000) NULL,
  `date` VARCHAR(256) NULL,
  `img` JSON NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idgallery_UNIQUE` (`id` ASC) VISIBLE);



CREATE TABLE `zmt`.`members` (
  `member_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `subscription_id` VARCHAR(256) NOT NULL,
  `status` VARCHAR(256) NOT NULL,
  `period_start` INT NOT NULL,
  `period_end` INT NOT NULL,
  `start_date` INT NOT NULL,
  `is_admin` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`member_id`),
  UNIQUE INDEX `idmembers_UNIQUE` (`member_id` ASC) VISIBLE)
COMMENT = 'This table holds information about all members that are signed up via the Website.';

ALTER TABLE `zmt`.`members` 
ADD COLUMN `cusomer_id` VARCHAR(256) NOT NULL AFTER `subscription_id`;




CREATE TABLE `zmt`.`payment_session` (
  `pay_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `session_id` VARCHAR(256) NOT NULL,
  `username` VARCHAR(256) NOT NULL,
  `user_password` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`pay_id`),
  UNIQUE INDEX `pay_id_UNIQUE` (`pay_id` ASC) VISIBLE)
COMMENT = 'This table stores user information and their session ids to authenticate if they have paid.';


ALTER TABLE `zmt`.`payment_session` 
ADD COLUMN `pay_key` VARCHAR(256) NOT NULL AFTER `user_password`;




CREATE TABLE `zmt`.`temp_sub` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sub_id` VARCHAR(256) NOT NULL,
  `customer_id` VARCHAR(256) NOT NULL,
  `period_end` INT NOT NULL,
  `period_start` INT NOT NULL,
  `start_date` INT NOT NULL,
  `status` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idtemp_sub_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'In this database the subscription ids are stored with the needed data for the members database.';



CREATE TABLE `zmt`.`invoice` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `pdf` VARCHAR(512) NOT NULL,
  `url` VARCHAR(512) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idinvoice_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table holds all the invoices of the users.';

ALTER TABLE `zmt`.`invoice` 
CHANGE COLUMN `user_id` `subscription_id` VARCHAR(256) NOT NULL ;



CREATE TABLE `zmt`.`team` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `aktualisiert` VARCHAR(128) NOT NULL,
  `leitsatz` VARCHAR(2048) NOT NULL,
  `text` VARCHAR(8192) NOT NULL,
  `bild` VARCHAR(256) NOT NULL,
  `members` JSON NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table holds the current team of the organisation zurich meets tanzania';




CREATE TABLE `zmt`.`calendar` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(512) NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This database holds all Events from zurich meets tanzania.';





ALTER TABLE `zmt`.`users` 
CHANGE COLUMN `username` `username` VARCHAR(256) NOT NULL ,
CHANGE COLUMN `password` `password` VARCHAR(256) NOT NULL ,
CHANGE COLUMN `name` `name` VARCHAR(256) NOT NULL ,
CHANGE COLUMN `family_name` `family_name` VARCHAR(256) NOT NULL ,
CHANGE COLUMN `email` `email` VARCHAR(256) NOT NULL ,
CHANGE COLUMN `picture` `picture` VARCHAR(512) NOT NULL DEFAULT '"/img/svg/personal.svg"' ,
CHANGE COLUMN `phone` `phone` VARCHAR(16) NOT NULL DEFAULT '"Keine Nummer"' ,
CHANGE COLUMN `type` `type` VARCHAR(256) NOT NULL DEFAULT '"user"' ,
CHANGE COLUMN `address` `address` VARCHAR(512) NOT NULL DEFAULT 'Keine Adresse' ;




ALTER TABLE `zmt`.`news` 
ADD COLUMN `date` TIMESTAMP NULL AFTER `pdf_src`;


ALTER TABLE `zmt`.`news` 
CHANGE COLUMN `date` `date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;





CREATE TABLE `zmt`.`blogs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(2048) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idblogs_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This is the new table for the blogs from ZMT.';





ALTER TABLE `zmt`.`news` 
DROP COLUMN `pdf_src`,
DROP COLUMN `pdf`,
DROP COLUMN `btn_link`,
DROP COLUMN `btn_text`,
DROP COLUMN `btn`,
CHANGE COLUMN `text` `html` JSON NOT NULL ,
CHANGE COLUMN `img_path` `type` VARCHAR(8) NOT NULL ,
CHANGE COLUMN `img_alt` `src` VARCHAR(2058) NOT NULL ,
CHANGE COLUMN `img_pos` `position` VARCHAR(8) NULL ;



ALTER TABLE `zmt`.`members` 
CHANGE COLUMN `cusomer_id` `customer_id` VARCHAR(256) NOT NULL ;





ALTER TABLE `zmt`.`news` 
ADD COLUMN `newsletter_is_sent` TINYINT NOT NULL AFTER `src`,
CHANGE COLUMN `position` `position` VARCHAR(8) NULL DEFAULT 'center' ;





CREATE TABLE `zmt`.`stripe_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(256) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idnew_table_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table stores all stripe events that are sent to the webhook.';



ALTER TABLE `zmt`.`news` 
CHANGE COLUMN `type` `type` VARCHAR(16) NOT NULL ;
