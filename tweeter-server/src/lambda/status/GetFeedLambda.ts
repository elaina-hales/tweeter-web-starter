import { PagedStatusItemRequest, PagedStatusItemResponse, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDaoFactory } from "../../dao/factory/DynamoDaoFactory";

export const handler = async(request: PagedStatusItemRequest) : Promise<PagedStatusItemResponse | TweeterResponse> => {
    const statusService = new StatusService(new DynamoDaoFactory);
    try {
        const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);
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