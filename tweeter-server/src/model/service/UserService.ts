import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../../dao/factory/DaoFactory";
import { UserDao } from "../../dao/UserDao";
import { UserTableData } from "../../dao/entity/UserTableData";
import { AuthtokenDao } from "../../dao/AuthtokenDao";
import { S3Dao } from "../../dao/S3DAO";
import * as bycrpt from "bcryptjs";

export class UserService implements Service {
  private userDao: UserDao;
  private authDao: AuthtokenDao;
  private s3Dao: S3Dao;

  constructor (daoFactory: DaoFactory) {
    this.userDao = daoFactory.createUserDao();
    this.authDao = daoFactory.createAuthtokenDao();
    this.s3Dao = daoFactory.createS3Dao();
  }
  
  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    // get request 
    const user = await this.userDao.getUser(alias);
    if (user == null){
      return null;
    }
    return user;
  };

  public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server

    // get hash from db
    // to check hash, bcrypt.compare(entered_pw, hashed_pw) 
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
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
      
      const [authtoken, timestamp] = await this.authDao.putToken();

      return [user, new AuthToken(authtoken, timestamp)];
    }
  };

  public async getIsFollowerStatus (
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  public async getFolloweeCount (
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  };

  public async getFollowerCount (
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  };

  public async logout(
    token: string,
  ): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

  public async unfollow (
    token: string,
    userToUnfollow: UserDto
  ) : Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  };

  public async follow (
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  };
}