import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected itemDescription(): string {
    return "load followees";
  }
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
    const followees = this.service.loadMoreFollowees(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem
    );
    console.log(followees);
    return followees;
  }
}