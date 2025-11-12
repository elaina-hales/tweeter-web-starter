import { AuthToken, Status, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
    private serverFacade = new ServerFacade;
    
    public async loadMoreFeedItems (
          authToken: AuthToken,
          userAlias: string,
          pageSize: number,
          lastItem: Status | null
        ): Promise<[Status[], boolean]> {
          // TODO: Replace with the result of calling server
        if (lastItem === null) {
            return this.serverFacade.getMoreFeedItems({token: authToken.token, userAlias: userAlias, pageSize: pageSize, lastItem: null});
        } else {
            return this.serverFacade.getMoreFeedItems({token: authToken.token, userAlias: userAlias, pageSize: pageSize, lastItem: lastItem.dto});
        }
    };
    
    public async loadMoreStoryItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]>{
        // TODO: Replace with the result of calling server
        if (lastItem === null) {
            return this.serverFacade.getMoreStoryItems({token: authToken.token, userAlias: userAlias, pageSize: pageSize, lastItem: null});
        } else {
            return this.serverFacade.getMoreStoryItems({token: authToken.token, userAlias: userAlias, pageSize: pageSize, lastItem: lastItem.dto});
        }    
    };

    public async postStatus (
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server to post the status
    };
    
}