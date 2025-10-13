import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export interface UserInfoView {
    displayErrorMessage: (message: string) => void;
}

export class UserInfoPresenter {
  private service: UserService;
  private view: UserInfoView;

  public constructor(view: UserInfoView) {
      this.service = new UserService();
      this.view = view;
  }

  public async getIsFollowerStatus (
      authToken: AuthToken,
      user: User,
      selectedUser: User
    ): Promise<boolean> {
      // TODO: Replace with the result of calling server
      return this.service.getIsFollowerStatus(authToken, user, selectedUser);
    };
  
  public async getFolloweeCount (
      authToken: AuthToken,
      user: User
    ): Promise<number> {
      // TODO: Replace with the result of calling server
      return this.service.getFolloweeCount(authToken, user);
  };
  
  public async getFollowerCount (
      authToken: AuthToken,
      user: User
      ): Promise<number> {
      // TODO: Replace with the result of calling server
      return this.service.getFollowerCount(authToken, user);
  };

  public async getUser (
      authToken: AuthToken,
      alias: string
      ): Promise<User | null> {
      // TODO: Replace with the result of calling server
      return this.service.getUser(authToken, alias);
  }; 

  public async follow (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await this.service.follow();

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  };

  public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await this.service.unfollow();

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  };

}