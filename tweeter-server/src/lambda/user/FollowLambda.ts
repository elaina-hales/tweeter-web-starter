import { FollowRequest, FollowResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: FollowRequest) : Promise<FollowResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    const [followerCount, followeeCount] = await userService.follow(request.token, request.userToFollow);
    
    return {
        success: true,
        message : null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}