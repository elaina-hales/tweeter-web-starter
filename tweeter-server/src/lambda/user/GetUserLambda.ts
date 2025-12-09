import { GetUserRequest, GetUserResponse, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: GetUserRequest) : Promise<GetUserResponse | TweeterResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    try {
        const user = await userService.getUser(request.token, request.userAlias);
        return {
            success: true,
            message : null,
            user: user,
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message
        }
    }
    
}