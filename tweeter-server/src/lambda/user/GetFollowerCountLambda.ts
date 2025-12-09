import { GetFollowerCountRequest, GetFollowerCountResponse, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: GetFollowerCountRequest) : Promise<GetFollowerCountResponse | TweeterResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    try {
        const numFollowers = await userService.getFollowerCount(request.token, request.user,);
        return {
            success: true,
            message : null,
            numFollowers: numFollowers
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message
        }
    }
    
}