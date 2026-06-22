CREATE TABLE `zmt`.`donationmeter` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` INT NOT NULL,
  `max` INT NOT NULL,
  `description` VARCHAR(512) NOT NULL,
  `title` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table holds the data of the donationmeter.';
