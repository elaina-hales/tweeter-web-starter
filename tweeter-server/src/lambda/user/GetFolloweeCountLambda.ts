import { GetFolloweeCountRequest, GetFolloweeCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: GetFolloweeCountRequest) : Promise<GetFolloweeCountResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    const numFollowees = await userService.getFolloweeCount(request.token, request.user,);
    
    return {
        success: true,
        message : null,
        numFollowees: numFollowees
    }
}