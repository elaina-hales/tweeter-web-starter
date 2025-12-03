import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User, UserDto } from "tweeter-shared";
import { UserDao } from "../UserDao";
import { UserTableData } from "../entity/UserTableData";

export class UserDaoDyanmoDB implements UserDao {
    readonly tableName = "usersTable";
    readonly passwordAttr = "password";
    readonly handleAttr = "handle";
    readonly firstNameAttr = "first_name";
    readonly lastNameAttr = "last_name";
    readonly urlAttr = "image_url";
    readonly followerCountAttr = "follower_count";
    readonly followeeCountAttr = "followee_count";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    private generateAliasItem(alias: string) {
        return {
            [this.handleAttr]: alias,
        };
    }

    async getUser(alias: string): Promise<UserDto | null> {
        const params = {
            TableName: this.tableName,
            Key: this.generateAliasItem(alias),
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
            ? null
            : {
                firstName: output.Item[this.firstNameAttr],
                lastName: output.Item[this.lastNameAttr],
                alias: output.Item[this.handleAttr],
                imageUrl: output.Item[this.urlAttr],
            };
    }

    async putUser(user: UserTableData) : Promise<User> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.handleAttr]: user.handle,
                [this.passwordAttr]: user.password,
                [this.firstNameAttr]: user.first_name,
                [this.lastNameAttr]: user.last_name,
                [this.urlAttr]: user.image_url,
                [this.followeeCountAttr]: user.followee_count,
                [this.followerCountAttr]: user.follower_count,

            },
        };
        await this.client.send(new PutCommand(params));
        return new User(user.first_name, user.last_name, user.handle, user.image_url);
    }
    
}