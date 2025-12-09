import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { FollowDao } from "../../dao/FollowDao";
import { DaoFactory } from "../../dao/factory/DaoFactory";
import { UserDao } from "../../dao/UserDao";
import { AuthtokenDao } from "../../dao/AuthtokenDao";

export class FollowService implements Service {
  private followDao: FollowDao;
  private userDao: UserDao;
  private authDao: AuthtokenDao;

  constructor (daoFactory: DaoFactory) {
    this.followDao = daoFactory.createFollowsDao();
    this.userDao = daoFactory.createUserDao();
    this.authDao = daoFactory.createAuthtokenDao();
  }
  
  public async loadMoreFollowees (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    let result = await this.isAuthorized(token);
    if (!result){
      throw new Error("Unauthorized");
    }
    const [follows, hasMore] = await this.followDao.getPageOfFollowees(userAlias, pageSize, lastItem?.alias);
    const items: UserDto[] = [];
    for (let follow of follows) {
      const item = await this.userDao.getUser(follow.followee_handle);
      if (item != null){
        items.push({
          firstName: item.first_name,
          lastName: item.last_name,
          alias: item.handle,
          imageUrl: item.image_url
        });
      }
    }
    return [items, hasMore];
  };
  

  public async loadMoreFollowers (
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
    let result = await this.isAuthorized(token);
    if (!result){
      throw new Error("Unauthorized");
    }
    const [follows, hasMore] = await this.followDao.getPageOfFollowers(userAlias, pageSize, lastItem?.alias);
    const items: UserDto[] = [];
    for (let follow of follows) {
      const item = await this.userDao.getUser(follow.follower_handle);
      if (item != null){
        items.push({
          firstName: item.first_name,
          lastName: item.last_name,
          alias: item.handle,
          imageUrl: item.image_url
        });
      }
    }
    return [items, hasMore];
  };

  // private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string) : Promise<[UserDto[], boolean]> {
  //   const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
  //   const dtos = items.map((user) => user.dto);
  //   return [dtos, hasMore];
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