import { GetIsFollowerRequest, GetIsFollowerResponse, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: GetIsFollowerRequest) : Promise<GetIsFollowerResponse | TweeterResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    try {
        const isFollower = await userService.getIsFollowerStatus(request.token, request.user, request.selectedUser);
        return {
            success: true,
            message : null,
            isFollower: isFollower,
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message
        }
    }
    
}