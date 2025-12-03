import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: GetUserRequest) : Promise<GetUserResponse> => {
    const userService = new UserService(new DynamoDaoFactory);
    const user = await userService.getUser(request.token, request.userAlias);
    
    return {
        success: true,
        message : null,
        user: user,
    }
}