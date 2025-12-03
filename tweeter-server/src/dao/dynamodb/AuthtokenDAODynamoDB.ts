import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { AuthtokenDao } from "../AuthtokenDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class AuthtokenDaoDynamoDB implements AuthtokenDao {
    readonly tableName = "sessionsTable";
    readonly authTokenAttr = "authtoken";
    readonly timestampAttr = "creation_timestamp";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    
    getToken(authToken: string): Promise<string | null> {
        throw new Error("Method not implemented.");
    }

    async putToken(): Promise<[string, number]> {
        const authToken = crypto.randomUUID();
        const timestamp: number = Date.now();
        const params = {
            TableName: this.tableName,
            Item: {
                [this.authTokenAttr]: authToken,
                [this.timestampAttr]: timestamp
            },
        };
        await this.client.send(new PutCommand(params));
        return [authToken, timestamp];
    }
}