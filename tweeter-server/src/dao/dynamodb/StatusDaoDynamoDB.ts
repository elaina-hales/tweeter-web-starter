import { StatusDao } from "../StatusDao";

export class StatusDaoDynamoDB implements StatusDao {
    readonly tableName = "storyTable";
    readonly followerAliasAttr = "handle";
    readonly timestampAttr = "timestamp";
    readonly postTextAttr = "post_text";
}