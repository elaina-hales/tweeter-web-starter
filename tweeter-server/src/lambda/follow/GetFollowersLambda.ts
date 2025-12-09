import { PagedUserItemRequest, PagedUserItemResponse, TweeterRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: PagedUserItemRequest) : Promise<PagedUserItemResponse | TweeterResponse> => {
    const followService = new FollowService(new DynamoDaoFactory);
    try {
        const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);
        return {
            success: true,
            message : null,
            items: items,
            hasMore: hasMore
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message
        }
    }
    
}