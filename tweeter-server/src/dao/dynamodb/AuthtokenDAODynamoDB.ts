import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { AuthtokenDao } from "../AuthtokenDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthTokenTableData } from "../entity/AuthTokenTableData";

export class AuthtokenDaoDynamoDB implements AuthtokenDao {
    readonly tableName = "sessionsTable";
    readonly authTokenAttr = "authtoken";
    readonly timestampAttr = "creation_timestamp";
    readonly userAliasAttr = "user_alias";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async putToken(alias: string): Promise<[string, number]> {
        const authToken: string = crypto.randomUUID();
        const timestamp: number = Date.now();
        const params = {
            TableName: this.tableName,
            Item: {
                [this.authTokenAttr]: authToken,
                [this.timestampAttr]: timestamp,
                [this.userAliasAttr]: alias
            },
        };
        await this.client.send(new PutCommand(params));
        return [authToken, timestamp];
    }

    async getToken(token: string): Promise<AuthTokenTableData | null> {
        const params = {
            TableName: this.tableName,
            Key: {[this.authTokenAttr]: token}
        };
        const output = await this.client.send(new GetCommand(params));
        console.log(output);
        return output.Item == undefined
        ? null
        : {
            authtoken: output.Item[this.authTokenAttr],
            timestamp: output.Item[this.timestampAttr],
            user_alias: output.Item[this.userAliasAttr]
        };
    }

    async deleteToken(token: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {[this.authTokenAttr]: token}
        };
        await this.client.send(new DeleteCommand(params));
    }
}