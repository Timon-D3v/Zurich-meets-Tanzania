ALTER TABLE `zmt`.`news` 
ADD COLUMN `newsletter_is_sent` TINYINT NOT NULL AFTER `src`,
CHANGE COLUMN `position` `position` VARCHAR(8) NULL DEFAULT 'center' ;
