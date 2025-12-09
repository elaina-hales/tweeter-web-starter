import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowTableData }  from "../entity/Follow";
import { FollowDao } from "../FollowDao";

export class FollowDAODynamoDB implements FollowDao {
  readonly tableName = "followsTable";
  readonly indexName = "follows_index";
  readonly followeeHandleAttr = "followee_handle";
  readonly followerHandleAttr = "follower_handle";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putFollow(follows: FollowTableData): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followeeHandleAttr]: follows.followee_handle,
        [this.followerHandleAttr]: follows.follower_handle,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async updateFollow(follows: FollowTableData, newFolloweeHandle: string, newFollowerHandle: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follows),
      ExpressionAttributeValues: { ":followerHandle": newFolloweeHandle, ":followeeHandle": newFollowerHandle },
      UpdateExpression:
        "SET " + this.followerHandleAttr + " = :followerHandle, " + this.followeeHandleAttr + " = :followeeHandle",
    };
    await this.client.send(new UpdateCommand(params));
  }

  async getFollow(follow: FollowTableData): Promise<FollowTableData | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follow),
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : new FollowTableData(
          output.Item[this.followerHandleAttr],
          output.Item[this.followeeHandleAttr],
        );
  }

  async deleteFollow(follows: FollowTableData): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follows),
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateFollowItem(follows: FollowTableData) {
    return {
      [this.followerHandleAttr]: follows.follower_handle,
      [this.followeeHandleAttr]: follows.followee_handle,
    };
  }

  async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[FollowTableData[], boolean]> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + " = :f",
      ExpressionAttributeValues: {
        ":f": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
              [this.followeeHandleAttr]: lastFolloweeHandle,
              [this.followerHandleAttr]: followerHandle,
            },
    };
    console.log(params);

    const items: FollowTableData[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new FollowTableData(
          item[this.followerHandleAttr],
          item[this.followeeHandleAttr],
        )
      )
    );
    return [items, hasMorePages];
  }

  async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[FollowTableData[], boolean]> {
    const params = {
      KeyConditionExpression: this.followeeHandleAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": followeeHandle,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
              [this.followeeHandleAttr]: followeeHandle,
              [this.followerHandleAttr]: lastFollowerHandle,
            },
    };

    const items: FollowTableData[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new FollowTableData(
          item[this.followerHandleAttr],
          item[this.followeeHandleAttr],
        )
      )
    );
    return [items, hasMorePages];
  }
}
