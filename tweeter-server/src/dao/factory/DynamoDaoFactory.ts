import { DaoFactory } from "./DaoFactory";
import { FollowDAODynamoDB } from "../dynamodb/FollowDAODynamoDB";
import { FollowDao } from "../FollowDao";
import { S3Dao } from "../S3DAO";
import { AuthtokenDaoDynamoDB } from "../dynamodb/AuthtokenDAODynamoDB";
import { FeedDaoDynamoDB } from "../dynamodb/FeedDAODynamoDB";
import { S3DaoDynamoDB } from "../dynamodb/S3DaoDynamoDB";
import { StatusDaoDynamoDB } from "../dynamodb/StatusDaoDynamoDB";
import { UserDaoDyanmoDB } from "../dynamodb/UserDAODynamoDB";

export class DynamoDaoFactory implements DaoFactory {
    createS3Dao(): S3Dao {
        return new S3DaoDynamoDB;
    }
    createFollowsDao(): FollowDao {
        return new FollowDAODynamoDB;
    }
    createUserDao() {
        return new UserDaoDyanmoDB;
    }
    createStatusDao() {
        return new StatusDaoDynamoDB;
    }
    createFeedDao() {
        return new FeedDaoDynamoDB;
    }
    createAuthtokenDao() {
        return new AuthtokenDaoDynamoDB;
    }
}