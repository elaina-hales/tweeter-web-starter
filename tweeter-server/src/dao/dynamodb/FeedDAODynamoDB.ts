import { FeedDao } from "../FeedDao";

export class FeedDaoDynamoDB implements FeedDao {
    readonly tableName = "feedTable";
    readonly followerAliasAttr = "follower_alias";
    readonly timestampAttr = "timestamp";
    readonly postTextAttr = "post_text";
    readonly posterHandleAttr = "poster_handle";
}

