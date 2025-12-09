import { LogoutRequest, LogoutResponse, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: LogoutRequest) : Promise<LogoutResponse | TweeterResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    try {
        await userService.logout(request.token);
        return {
            success: true,
            message : null,
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message
        }
    }
    
}