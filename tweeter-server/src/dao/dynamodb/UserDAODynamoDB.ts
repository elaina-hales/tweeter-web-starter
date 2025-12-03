import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Follow }  from "../entity/Follow";
import { DataPage } from "../entity/DataPage";
import { FollowDao } from "../FollowDao";
import { UserDto } from "tweeter-shared";
import { UserDao } from "../UserDao";

export class UserDaoDyanmoDB implements UserDao {
    readonly tableName = "users";
    readonly indexName = "users-index";
    readonly userAliasAttr = "";
    readonly urlAttr = "";
    readonly firstNameAttr = "";
    readonly lastNameAttr = "";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    
    async getUser(alias: string): Promise<UserDto | null> {
        const params = {
            TableName: this.tableName,
            Key: this.generateUserItem(alias),
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
            ? null
            : {
                firstName: output.Item[this.firstNameAttr],
                lastName: output.Item[this.lastNameAttr],
                alias: output.Item[this.userAliasAttr],
                imageUrl: output.Item[this.urlAttr],
            };
    }

    private generateUserItem(alias: string) {
        return {
            [this.userAliasAttr]: alias,
        };
    }
    
}