import { DataPage } from "./entity/DataPage";
import { FeedTableData } from "./entity/FeedTableData";

export interface FeedDao {
    //putFollow(follows: FollowTableData): Promise<void>;
        // updateF(follows: FollowTableData, newFolloweeName: string, newFollowerName: string): Promise<void>;
        // getFollow(follow: FollowTableData): Promise<FollowTableData | undefined>
        // deleteFollow(follows: FollowTableData): Promise<void>
    putStatus(status: FeedTableData): Promise<void>
    getPageOfFeed(followerHandle: string, pageSize: number, lastTimestamp: number | undefined): Promise<DataPage<FeedTableData>>
}