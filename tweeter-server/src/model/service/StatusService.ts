import { Service } from "./Service";
import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";
import { AuthtokenDao } from "../../dao/AuthtokenDao";
import { DaoFactory } from "../../dao/factory/DaoFactory";
import { UserDao } from "../../dao/UserDao";
import { FeedDao } from "../../dao/FeedDao";
import { StatusDao } from "../../dao/StatusDao";
import { StatusTableData } from "../../dao/entity/StatusTableData";
import { DataPage } from "../../dao/entity/DataPage";
import { FollowDao } from "../../dao/FollowDao";
import { User } from "tweeter-shared";
import { FollowService } from "./FollowService";
import { FeedTableData } from "../../dao/entity/FeedTableData";

export class StatusService implements Service {
    private userDao: UserDao;
    private authDao: AuthtokenDao;
    private storyDao: StatusDao;
    private feedDao: FeedDao;
    private followDao: FollowDao;
    private followService: FollowService;
    
    constructor (daoFactory: DaoFactory) {
        this.userDao = daoFactory.createUserDao();
        this.authDao = daoFactory.createAuthtokenDao();
        this.storyDao = daoFactory.createStatusDao();
        this.feedDao = daoFactory.createFeedDao();
        this.followDao = daoFactory.createFollowsDao();
        this.followService = new FollowService(daoFactory);
    }

    public async loadMoreFeedItems (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        let result = await this.isAuthorized(token);
        if (!result){
            throw new Error("Unauthorized");
        } else {
            const page: DataPage<FeedTableData> = await this.feedDao.getPageOfFeed(userAlias, pageSize, lastItem?.timestamp);
            const feedData: FeedTableData[] = page.values;
            const hasMore = page.hasMorePages;
            const items: StatusDto[] = [];
            for (let status of feedData) {
                const item = await this.userDao.getUser(status.followerAlias);
                if (item != null){
                    items.push({
                        post: status.post_text,
                        user: {firstName: item?.first_name, lastName: item?.last_name, alias: item.handle, imageUrl: item.image_url},
                        timestamp: status.timestamp,
                    });
                }
            }
            return [items, hasMore];
        }
    };
    
    public async loadMoreStoryItems (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]>{
        let result = await this.isAuthorized(token);
        if (!result){
            throw new Error("Unauthorized");
        } else {
            const page: DataPage<StatusTableData> = await this.storyDao.getPageOfStoryItems(userAlias, pageSize, lastItem?.timestamp);
            const statusData: StatusTableData[] = page.values;
            const hasMore = page.hasMorePages;
            const items: StatusDto[] = [];
            if (statusData == null) {
                throw new Error("No data found.")
            } else {
                for (let status of statusData) {
                    const item = await this.userDao.getUser(status.handle);
                    if (item != null){
                        items.push({
                            post: status.post_text,
                            user: {firstName: item?.first_name, lastName: item?.last_name, alias: item.handle, imageUrl: item.image_url},
                            timestamp: status.timestamp,
                        });
                    }
                }
                return [items, hasMore];
            }
        }
    };

    public async postStatus (
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        let result = await this.isAuthorized(token);
        if (!result){
            throw new Error("Unauthorized");
        } else {
            await this.storyDao.putStatus(new StatusTableData(newStatus.user.alias, newStatus.timestamp, newStatus.post));
            let hasMore = false;
            let followers = null;
            let [follows, has] = await this.followService.loadMoreFollowers(token, newStatus.user.alias, 10, null);
            followers = follows;
            console.log(followers);
            hasMore = has;
            while (hasMore === true) {
                [follows, has] = await this.followService.loadMoreFollowers(token, newStatus.user.alias, 10, followers.at(-1)!);
                followers = followers.concat(follows);
                hasMore = has;
            }
            console.log(followers);
            for (let follower of followers) {
                await this.feedDao.putStatus(new FeedTableData(newStatus.user.alias, newStatus.timestamp, newStatus.post, follower.alias));
            }
        }
    };

    // private async getFakeData(lastItem: StatusDto | null, pageSize: number) : Promise<[StatusDto[], boolean]> {
    //     const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    //     const dtos = items.map((status) => status.dto);
    //     return [dtos, hasMore];
    // }

    private async isAuthorized(token: string) : Promise<boolean> {
        let result = await this.authDao.getToken(token);
        if (result == null){
            return false;
        } else {
            return true;
        }
    }
    
}