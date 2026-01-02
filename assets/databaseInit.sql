CREATE SCHEMA IF NOT EXISTS `zmt`;



USE `zmt`;



CREATE TABLE IF NOT EXISTS `zmt`.`users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(256) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `firstName` VARCHAR(256) NOT NULL,
    `lastName` VARCHAR(256) NOT NULL,
    `phone` VARCHAR(16) NOT NULL DEFAULT 'Keine Nummer',
    `address` VARCHAR(256) NOT NULL,
    `type` VARCHAR(16) NOT NULL DEFAULT 'user',
    `picture` VARCHAR(512) NOT NULL DEFAULT '/img/svg/personal.svg',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `user_id_UNIQUE` (`id` ASC) VISIBLE,
    UNIQUE INDEX `user_email_UNIQUE` (`email` ASC) VISIBLE
)
COMMENT = 'This table holds all the userdata from zmt.';



CREATE TABLE IF NOT EXISTS `zmt`.`darkmode` (
    `userId` INT NOT NULL,
    `darkmode` TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (`userId`),
    UNIQUE INDEX `darkmode_user_id_UNIQUE` (`userId` ASC) VISIBLE
)
COMMENT = 'This table holds the darkmode session of the user that are logged in.';



CREATE TABLE IF NOT EXISTS `zmt`.`blogs` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(256) NOT NULL,
    `author` VARCHAR(256) NOT NULL,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data` JSON NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `blog_title_UNIQUE` (`title` ASC) VISIBLE
)
COMMENT = 'This table holds all the blogs.';



CREATE TABLE IF NOT EXISTS `zmt`.`news` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data` JSON NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `news_id_UNIQUE` (`id` ASC) VISIBLE
)
COMMENT = 'This table holds all the blogs.';



CREATE TABLE IF NOT EXISTS `zmt`.`newsletter` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(256) NOT NULL,
    `gender` VARCHAR(8) NOT NULL,
    `firstName` VARCHAR(256) NOT NULL,
    `lastName` VARCHAR(256) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `newsletter_id_UNIQUE` (`id` ASC) VISIBLE
)
COMMENT = 'All people who have registered for the newsletter are stored in this database table.';



CREATE TABLE IF NOT EXISTS `zmt`.`calendar` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `title` VARCHAR(256) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `calendar_id_UNIQUE` (`id` ASC) VISIBLE
)
COMMENT = 'This table holds all events from zurich meets tanzania.';



CREATE TABLE IF NOT EXISTS `zmt`.`gallery` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(256) NOT NULL,
    `subtitle` VARCHAR(512) NOT NULL,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data` JSON NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `gallery_title_UNIQUE` (`title` ASC) VISIBLE
)
COMMENT = 'This is a collection of images from the hospital in Ifisi Tanzania.';



CREATE TABLE IF NOT EXISTS `zmt`.`members` (
    `memberId` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NOT NULL,
    `subscriptionId` VARCHAR(256) NOT NULL,
    `customerId` VARCHAR(256) NOT NULL,
    `status` VARCHAR(32) NOT NULL,
    `periodStartTime` BIGINT NOT NULL,
    `periodEndTime` BIGINT NOT NULL,
    `subscriptionStartTime` BIGINT NOT NULL,
    PRIMARY KEY (`memberId`),
    UNIQUE INDEX `members_user_id_UNIQUE` (`userId` ASC) VISIBLE
)
COMMENT = 'This table holds the payment information about all members that are subscribed to the membership of zmt.';



CREATE TABLE IF NOT EXISTS `zmt`.`payments` (
    `paymentId` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NOT NULL,
    `sessionId` VARCHAR(256) NOT NULL,
    `paymentKey` VARCHAR(512) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`paymentId`),
    UNIQUE INDEX `payment_id_UNIQUE` (`paymentId` ASC) VISIBLE,
    UNIQUE INDEX `payment_user_id_UNIQUE` (`userId` ASC) VISIBLE,
    UNIQUE INDEX `payment_session_id_UNIQUE` (`sessionId` ASC) VISIBLE,
    UNIQUE INDEX `payment_email_UNIQUE` (`email` ASC) VISIBLE
)
COMMENT = 'This table stores user information and their session ids to authenticate and validate if they have paid.';



CREATE TABLE IF NOT EXISTS `zmt`.`invoices` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `subscriptionId` VARCHAR(256) NOT NULL,
    `invoicePdf` VARCHAR(512) NOT NULL,
    `invoiceUrl` VARCHAR(512) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `invoice_subscription_id_UNIQUE` (`subscriptionId` ASC) VISIBLE
)
COMMENT = 'This table holds all the invoices of the members.';



CREATE TABLE IF NOT EXISTS `zmt`.`team` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `motto` VARCHAR(512) NOT NULL,
    `text` TEXT NOT NULL,
    `members` JSON NOT NULL,
    `picture` VARCHAR(512) NOT NULL,
    `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `team_id_UNIQUE` (`id` ASC) VISIBLE
)
COMMENT = 'This table holds the current team of zmt';
