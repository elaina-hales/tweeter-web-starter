import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";

export const PAGE_SIZE = 10;
export interface UserInfoView extends MessageView {
  setIsLoading:(loading: boolean) => void;
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  setIsFollower: (isFollower: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: UserService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new UserService();
  }

  public async setIsFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReortingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    }, "determine follower status");
  };

  public async setNumbFollowees (
    authToken: AuthToken,
    displayedUser: User
  ) {
    this.doFailureReortingOperation(async () => {
      this.view.setFolloweeCount(await this.service.getFolloweeCount(authToken, displayedUser));
    }, "get followees count");
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    this.doFailureReortingOperation(async () => {
      this.view.setFollowerCount(await this.service.getFollowerCount(authToken, displayedUser));
    }, "get followers count")
  };

  public async follow (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<void> {
    await this.followUnfollow(
      userToFollow,
      "follow",
      "Following",
      false,
      () => this.service.follow(authToken, userToFollow)
    );
  };

  public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<void> {
    await this.followUnfollow(
      userToUnfollow,
      "unfollow",
      "Unfollowing",
      true,
      () => this.service.unfollow(authToken, userToUnfollow)
    );
  };

  public async followUnfollow(
    userToFollowUnFollow: User,
    errorDescription: string,
    toastDescription: string,
    isUnfollow: boolean,
    returnVal: () => Promise<[number, number]>
  ): Promise<void> {
    var userToast = "";
    await this.doFailureReortingOperation(async () => {
      this.view.setIsLoading(true);
      userToast = this.view.displayInfoMessage(`${toastDescription} ${userToFollowUnFollow!.name}...`, 0);

      const [followerCount, followeeCount] = await returnVal();

      this.view.setIsFollower(isUnfollow);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, errorDescription);
    this.view.deleteMessage(userToast);
    this.view.setIsLoading(false);
  }
}