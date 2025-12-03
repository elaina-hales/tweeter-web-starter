import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: LogoutRequest) : Promise<LogoutResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    await userService.logout(request.token);
    
    return {
        success: true,
        message : null,
    }
}