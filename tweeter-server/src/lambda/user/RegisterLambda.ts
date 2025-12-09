import { RegisterRequest, RegisterResponse, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: RegisterRequest) : Promise<RegisterResponse | TweeterResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    try {
        const [user, authToken] = await userService.register(request.alias, request.password, request.firstName, request.lastName, request.userImageBytes, request.imageFileExtension);
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