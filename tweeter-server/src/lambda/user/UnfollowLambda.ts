import { UnfollowRequest, UnfollowResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: UnfollowRequest) : Promise<UnfollowResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    const [followerCount, followeeCount] = await userService.unfollow(request.token, request.userToUnfollow);
    
    return {
        success: true,
        message : null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}