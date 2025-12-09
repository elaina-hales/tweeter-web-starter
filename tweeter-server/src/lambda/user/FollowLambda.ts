import { FollowRequest, FollowResponse, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: FollowRequest) : Promise<FollowResponse | TweeterResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    try {
        const [followerCount, followeeCount] = await userService.follow(request.token, request.userToFollow);
        return {
            success: true,
            message : null,
            followerCount: followerCount,
            followeeCount: followeeCount
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message
        }
    }
    
}