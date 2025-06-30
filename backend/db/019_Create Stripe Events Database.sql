CREATE TABLE `zmt`.`stripe_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(256) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idnew_table_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table stores all stripe events that are sent to the webhook.';
