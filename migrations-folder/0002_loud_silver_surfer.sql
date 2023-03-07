ALTER TABLE User ADD `role` text;
ALTER TABLE User ADD `isOnboarded` integer DEFAULT 0;
ALTER TABLE User ADD `onboardingStep` integer DEFAULT 1;
ALTER TABLE User ADD `nickname` text;
ALTER TABLE User ADD `hasAgreedToToS` integer DEFAULT 0;