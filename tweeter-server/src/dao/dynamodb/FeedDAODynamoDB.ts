import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { FeedDao } from "../FeedDao";
import { FeedTableData } from "../entity/FeedTableData";
import { StatusTableData } from "../entity/StatusTableData";
import { DataPage } from "../entity/DataPage";

export class FeedDaoDynamoDB implements FeedDao {
    readonly tableName = "feedTable";
    readonly followerAliasAttr = "follower_alias";
    readonly timestampAttr = "timestamp";
    readonly postTextAttr = "post_text";
    readonly posterHandleAttr = "poster_handle";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async getPageOfFeed(followerHandle: string, pageSize: number, lastTimestamp: number | undefined): Promise<DataPage<FeedTableData>> {
        const params = {
            KeyConditionExpression: this.followerAliasAttr + " = :v",
            ExpressionAttributeValues: {
            ":v": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
            lastTimestamp === undefined
                ? undefined
                : {
                    [this.followerAliasAttr]: followerHandle,
                    [this.timestampAttr]: lastTimestamp,
                },
            ScanIndexForward: false

        };
        
        const items: FeedTableData[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new FeedTableData(
                    item[this.followerAliasAttr],
                    item[this.timestampAttr],
                    item[this.postTextAttr],
                    item[this.posterHandleAttr]
                )
            )
        );
        return new DataPage<FeedTableData>(items, hasMorePages);
    }

    async putStatus(status: FeedTableData): Promise<void> {
        const params = {
          TableName: this.tableName,
          Item: {
            [this.followerAliasAttr]: status.followerAlias,
            [this.timestampAttr]: status.timestamp,
            [this.postTextAttr]: status.post_text,
            [this.posterHandleAttr]: status.handle,
          },
        };
        await this.client.send(new PutCommand(params));
    }

}

