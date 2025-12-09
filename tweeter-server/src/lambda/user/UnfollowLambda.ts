import { TweeterResponse, UnfollowRequest, UnfollowResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: UnfollowRequest) : Promise<UnfollowResponse  | TweeterResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    try {
        const [followerCount, followeeCount] = await userService.unfollow(request.token, request.userToUnfollow);
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