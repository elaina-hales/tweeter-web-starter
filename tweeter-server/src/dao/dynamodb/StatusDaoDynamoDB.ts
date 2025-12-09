import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StatusDao } from "../StatusDao";
import { DynamoDBClient,  } from "@aws-sdk/client-dynamodb";
import { StatusTableData } from "../entity/StatusTableData";
import { DataPage } from "../entity/DataPage";

export class StatusDaoDynamoDB implements StatusDao {
    readonly tableName = "storyTable";
    readonly handleAttr = "handle";
    readonly timestampAttr = "timestamp";
    readonly postTextAttr = "post_text";
    
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async getPageOfStoryItems(
        userAlias: string,
        pageSize: number,
        lastTimestamp: number | undefined
    ): Promise<DataPage<StatusTableData>> {
        const params = {
            KeyConditionExpression: this.handleAttr + " = :user",
            ExpressionAttributeValues: {
                ":user": userAlias,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastTimestamp === undefined
                ? undefined
                : {
                    [this.handleAttr]: userAlias,
                    [this.timestampAttr]: lastTimestamp,
                    },
            ScanIndexForward: false
        };
        const items: StatusTableData[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new StatusTableData(
                    item[this.handleAttr],
                    item[this.timestampAttr],
                    item[this.postTextAttr]
                )
            )
        );
        return new DataPage<StatusTableData>(items, hasMorePages);
    }

    async putStatus(data: StatusTableData): Promise<void> {
        const params = {
          TableName: this.tableName,
          Item: {
            [this.handleAttr]: data.handle,
            [this.timestampAttr]: data.timestamp,
            [this.postTextAttr]: data.post_text
          },
        };
        await this.client.send(new PutCommand(params));
    }

}