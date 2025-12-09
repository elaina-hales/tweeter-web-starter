import { AuthToken, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../../dao/factory/DaoFactory";
import { UserDao } from "../../dao/UserDao";
import { UserTableData } from "../../dao/entity/UserTableData";
import { AuthtokenDao } from "../../dao/AuthtokenDao";
import { S3Dao } from "../../dao/S3DAO";
import * as bycrpt from "bcryptjs";
import { FollowDao } from "../../dao/FollowDao";
import { FollowTableData } from "../../dao/entity/Follow";

export class UserService implements Service {
  private userDao: UserDao;
  private authDao: AuthtokenDao;
  private s3Dao: S3Dao;
  private followDao: FollowDao;

  constructor (daoFactory: DaoFactory) {
    this.userDao = daoFactory.createUserDao();
    this.authDao = daoFactory.createAuthtokenDao();
    this.s3Dao = daoFactory.createS3Dao();
    this.followDao = daoFactory.createFollowsDao();
  }
  
  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    let result = await this.isAuthorized(token);
    if (!result){
      throw new Error("Unauthorized");
    } else {
      const user = await this.userDao.getUser(alias);
      if (user == null){
        return null;
      }
      return {
        firstName: user.first_name,
        lastName: user.last_name,
        alias: user.handle,
        imageUrl: user.image_url
      };
    }
  };

  public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    let user = await this.userDao.getUser(alias);
    if (user === null){
      throw new Error("Invalid username.");
    } else {
      let result = await bycrpt.compare(password, user.password);
      if (result === false) {
        throw new Error("Invalid password.");
      } else {
        const [authToken, timestamp] = await this.authDao.putToken(alias);
        let final_user = new User(user.first_name, user.last_name, user.handle, user.image_url);
        return [final_user, new AuthToken(authToken, timestamp)];
      }
    }
  };
    
  public async register (
    alias: string,
    password: string,
    firstName: string,
    lastName: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const user = await this.userDao.getUser(alias);

    if (user) {
      throw new Error("Alias is already taken.");
    } else {

      const salt = await bycrpt.genSaltSync(10);
      const hash = await bycrpt.hashSync(password, salt);
      
      const url = await this.s3Dao.putImage(firstName + imageFileExtension, userImageBytes);

      let userData: UserTableData = new UserTableData(alias, hash, firstName, lastName, url, 0, 0);

      let user: User = await this.userDao.putUser(userData);
      
      const [authtoken, timestamp] = await this.authDao.putToken(alias);

      return [user, new AuthToken(authtoken, timestamp)];
    }
  };

  public async getIsFollowerStatus (
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    let result = await this.isAuthorized(token);
    if (!result){
      throw new Error("Unauthorized");
    } else {
      let ret_user = await this.followDao.getFollow(new FollowTableData(user.alias, selectedUser.alias))
      if (ret_user == null){
        return false;
      } if ((ret_user.followee_handle === user.alias) && (ret_user.follower_handle == selectedUser.alias)) {
        return true;
      } else {
        return true;

      }
    }
  };

  public async getFolloweeCount (
    token: string,
    user: UserDto
  ): Promise<number> {
    let result = await this.isAuthorized(token);
    if (!result){
      throw new Error("Unauthorized");
    } else {
      let ret_user = await this.userDao.getUser(user.alias);
      if (ret_user == null) {
        throw new Error("No user found.");
      } else {
        return ret_user.followee_count;
      }
    }
  };

  public async getFollowerCount (
    token: string,
    user: UserDto
  ): Promise<number> {
    let result = await this.isAuthorized(token);
    if (!result){
      throw new Error("Unauthorized");
    } else {
      let ret_user = await this.userDao.getUser(user.alias);
      if (ret_user == null) {
        throw new Error("No user found.");
      } else {
        return ret_user.follower_count;
      }
    }
  };

  public async logout(
    token: string,
  ): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    let result = await this.isAuthorized(token);
    if (!result){
      throw new Error("Unauthorized");
    } else {
      await this.authDao.deleteToken(token);
    }
    // await new Promise((res) => setTimeout(res, 1000));
  };

  public async unfollow (
    token: string,
    userToUnfollow: UserDto
  ) : Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
    let authTokenData = await this.authDao.getToken(token);
    if (authTokenData == null) {
      throw new Error("Unauthorized");
    }
    let self_alias = authTokenData?.user_alias;
    if (self_alias === null) {
      throw new Error("User not found");
    } else {
      await this.followDao.deleteFollow(new FollowTableData(self_alias, userToUnfollow.alias));
      await this.userDao.updateFolloweeCount(self_alias, -1);
      await this.userDao.updateFollowerCount(userToUnfollow.alias, -1);
      // +1 followeecount of self, +1 to followercount of other person
    }
    
    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  };

  public async follow (
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    let authTokenData = await this.authDao.getToken(token);
    if (authTokenData == null) {
      throw new Error("Unauthorized");
    }
    let self_alias = authTokenData?.user_alias;
    if (self_alias === null) {
      throw new Error("User not found");
    } else {
      await this.followDao.putFollow(new FollowTableData(self_alias, userToFollow.alias));
      await this.userDao.updateFolloweeCount(self_alias, 1);
      await this.userDao.updateFollowerCount(userToFollow.alias, 1);
    }
  
    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  };


  private async isAuthorized(token: string) : Promise<boolean> {
    let result = await this.authDao.getToken(token);
    if (result == null){
      return false;
    } else {
      return true;
    }
  }
}