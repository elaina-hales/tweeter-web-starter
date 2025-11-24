import { User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { FollowDao } from "../../dao/FollowDao";
import { DaoFactory } from "../../dao/factory/DaoFactory";

export class FollowService implements Service {
  private followDao: FollowDao;

  constructor (daoFactory: DaoFactory) {
    this.followDao = daoFactory.createFollowsDao();
  }
  
  public async loadMoreFollowees (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    const [follows, hasMore] = await this.followDao.getPageOfFollowees(userAlias, pageSize, lastItem?.alias);
    return this.getFakeData(lastItem, pageSize, userAlias);
  };
  

  public async loadMoreFollowers (
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
      // TODO: Replace with the result of calling server
      return this.getFakeData(lastItem, pageSize, userAlias);
  };

  private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string) : Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

}