import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;
export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  setIsLoading:(loading: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  setIsFollower: (isFollower: boolean) => void;
  deleteMessage: (message: string) => void;
}

export class UserInfoPresenter {
  private service: UserService;
  private view: UserInfoView;

  public constructor(view: UserInfoView) {
    this.service = new UserService();
    this.view = view;
  }

  public async setIsFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`,
      )
    }
  };

  public async setNumbFollowees (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFolloweeCount(await this.service.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFollowerCount(await this.service.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  public async follow (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<void> {
        var followingUserToast = "";

    try {
      this.view.setIsLoading(true);
      followingUserToast = this.view.displayInfoMessage(
        `Following ${userToFollow!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.service.follow(
        authToken!,
        userToFollow!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  };

  public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<void> {
    var unfollowingUserToast = "";

    try {

      this.view.setIsLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(`Unfollowing ${userToUnfollow!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.unfollow(
        authToken!,
        userToUnfollow!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setIsLoading(false);
    }
  };

}