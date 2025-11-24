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

export class FollowDAODynamoDB implements FollowDao {
  readonly tableName = "follows";
  readonly indexName = "follows-index";
  readonly followeeNameAttr = "followee_name";
  readonly followerNameAttr = "follower_name";
  readonly followeeHandleAttr = "followee_handle";
  readonly followerHandleAttr = "follower_handle";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putFollow(follows: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followeeHandleAttr]: follows.followee_handle,
        [this.followerHandleAttr]: follows.follower_handle,
        [this.followerNameAttr]: follows.follower_name,
        [this.followeeNameAttr]: follows.followee_name,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async updateFollow(follows: Follow, newFolloweeName: string, newFollowerName: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follows),
      ExpressionAttributeValues: { ":followerName": newFollowerName, ":followeeName": newFolloweeName },
      UpdateExpression:
        "SET " + this.followerNameAttr + " = :followerName, " + this.followeeNameAttr + " = :followeeName",
    };
    await this.client.send(new UpdateCommand(params));
  }

  async getFollow(follow: Follow): Promise<Follow | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follow),
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : new Follow(
          output.Item[this.followeeHandleAttr],
          output.Item[this.followerHandleAttr],
          output.Item[this.followeeNameAttr],
          output.Item[this.followerNameAttr]
        );
  }

  async deleteFollow(follows: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follows),
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateFollowItem(follows: Follow) {
    return {
      [this.followerHandleAttr]: follows.follower_handle,
      [this.followeeHandleAttr]: follows.followee_handle,
    };
  }

  async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[Follow[], boolean]> {
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

    const items: Follow[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Follow(
          item[this.followeeHandleAttr],
          item[this.followerHandleAttr],
          item[this.followeeNameAttr],
          item[this.followerNameAttr]
        )
      )
    );

    return [items, hasMorePages];
  }

  async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follow>> {
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

    const items: Follow[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Follow(
          item[this.followeeHandleAttr],
          item[this.followerHandleAttr],
          item[this.followeeNameAttr],
          item[this.followerNameAttr]
        )
      )
    );
    return new DataPage<Follow>(items, hasMorePages);
  }
}
