-- Expand VARCHAR(191) text columns so blog/product/site content is not truncated.
-- Safe to re-run: MODIFY is idempotent for same types.

ALTER TABLE `BlogPost`
  MODIFY `excerpt` TEXT NULL,
  MODIFY `content` TEXT NOT NULL,
  MODIFY `image` TEXT NULL;

ALTER TABLE `Product`
  MODIFY `description` TEXT NULL,
  MODIFY `shortDesc` TEXT NULL,
  MODIFY `image` TEXT NULL,
  MODIFY `images` TEXT NOT NULL,
  MODIFY `specs` TEXT NOT NULL;

ALTER TABLE `Category`
  MODIFY `description` TEXT NULL,
  MODIFY `image` TEXT NULL;

ALTER TABLE `Project`
  MODIFY `description` TEXT NULL,
  MODIFY `image` TEXT NULL,
  MODIFY `images` TEXT NOT NULL;

ALTER TABLE `SiteContent`
  MODIFY `content` TEXT NOT NULL;

ALTER TABLE `SiteSetting`
  MODIFY `value` TEXT NOT NULL;

ALTER TABLE `ContactMessage`
  MODIFY `message` TEXT NOT NULL;

ALTER TABLE `Customer`
  MODIFY `notes` TEXT NULL;

ALTER TABLE `Order`
  MODIFY `address` TEXT NULL,
  MODIFY `note` TEXT NULL;
