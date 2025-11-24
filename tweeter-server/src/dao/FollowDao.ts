import { Follow } from "./entity/Follow";
import { DataPage } from "./entity/DataPage";
import { UserDto } from "tweeter-shared";

export interface FollowDao {
    putFollow(follows: Follow): Promise<void>;
    updateFollow(follows: Follow, newFolloweeName: string, newFollowerName: string): Promise<void>;
    getFollow(follow: Follow): Promise<Follow | undefined>
    deleteFollow(follows: Follow): Promise<void>
    getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[Follow[], boolean]>
    getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follow>>
}