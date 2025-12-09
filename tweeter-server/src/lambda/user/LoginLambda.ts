import { LoginRequest, LoginResponse, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: LoginRequest) : Promise<LoginResponse | TweeterResponse> => {
    const userService = new UserService(new DynamoDaoFactory());
    try {
        const [user, authToken] = await userService.login(request.alias, request.password);
        return {
            success: true,
            message: null,
            user: user.dto,
            token: authToken.dto
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message
        }
    }
}