import { FollowTableData } from "./entity/Follow";

export interface FollowDao {
    putFollow(follows: FollowTableData): Promise<void>;
    updateFollow(follows: FollowTableData, newFolloweeName: string, newFollowerName: string): Promise<void>;
    getFollow(follow: FollowTableData): Promise<FollowTableData | undefined>
    deleteFollow(follows: FollowTableData): Promise<void>
    getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[FollowTableData[], boolean]>
    getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[FollowTableData[], boolean]>
}