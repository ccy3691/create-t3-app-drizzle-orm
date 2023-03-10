CREATE TABLE Account (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	FOREIGN KEY (`userId`) REFERENCES User(`id`)
);

CREATE TABLE Session (
	`id` text PRIMARY KEY NOT NULL,
	`sessionToken` text NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES User(`id`)
);

CREATE TABLE User (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`expires` integer,
	`image` text,
	`role` text,
	`isOnboarded` integer DEFAULT 0,
	`onboardingStep` integer DEFAULT 1,
	`nickname` text,
	`hasAgreedToToS` integer DEFAULT 0
);

CREATE TABLE VerificationToken (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL
);

CREATE UNIQUE INDEX providerIdx ON Account (`provider`,`providerAccountId`);
CREATE UNIQUE INDEX sessionTokenIdx ON Session (`sessionToken`);
CREATE UNIQUE INDEX emailIdx ON User (`email`);
CREATE UNIQUE INDEX tokenIdx ON VerificationToken (`identifier`,`token`);