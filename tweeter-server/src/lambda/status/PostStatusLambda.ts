import { PostStatusRequest, PostStatusResponse, Status, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: PostStatusRequest) : Promise<PostStatusResponse | TweeterResponse> => {
    const statusService = new StatusService(new DynamoDaoFactory);
    try {
        await statusService.postStatus(request.token, request.post);
        return {
            success: true,
            message: null,
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message
        }
    }
}