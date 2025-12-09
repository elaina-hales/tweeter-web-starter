import { GetFolloweeCountRequest, GetFolloweeCountResponse, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: GetFolloweeCountRequest) : Promise<GetFolloweeCountResponse | TweeterResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    try {
        const numFollowees = await userService.getFolloweeCount(request.token, request.user,);
        return {
            success: true,
            message : null,
            numFollowees: numFollowees
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message
        }
    }
    
}