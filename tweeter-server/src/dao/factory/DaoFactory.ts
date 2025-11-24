import { AuthtokenDao } from "../AuthtokenDao";
import { FeedDao } from "../FeedDao";
import { FollowDao } from "../FollowDao";
import { S3Dao } from "../S3DAO";
import { StatusDao } from "../StatusDao";
import { UserDao } from "../UserDao";

export interface DaoFactory {
    createFollowsDao(): FollowDao;
    createUserDao(): UserDao;
    createStatusDao(): StatusDao;
    createFeedDao(): FeedDao;
    createAuthtokenDao(): AuthtokenDao;
    createS3Dao(): S3Dao;
}