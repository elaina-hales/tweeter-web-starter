import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: LoginRequest) : Promise<LoginResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    const [user, authToken] = await userService.login(request.alias, request.password);
    
    return {
        success: true,
        message : null,
        user: user.dto,
        token: authToken.dto
    }
}