import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export interface NavigationView {
  displayErrorMessage: (message: string) => void,
  navigate: any,
  setDisplayedUser: any
}

export class NavigationPresenter {
    private view: NavigationView;
    private service: UserService;

    public constructor(view: NavigationView) {
        this.view = view;
        this.service = new UserService();
    }

    public async navigateToUser (event: React.MouseEvent, path: string, authToken: AuthToken, displayedUser: User): Promise<void> {
      try {
        const alias = this.extractAlias(event.target.toString());
  
        const toUser = await this.service.getUser(authToken!, alias);
  
        if (toUser) {
          if (!toUser.equals(displayedUser!)) {
            this.view.setDisplayedUser(toUser);
            this.view.navigate(`${path}/${toUser.alias}`);
          }
        }
      } catch (error) {
        this.view.displayErrorMessage(
          `Failed to get user because of exception: ${error}`,
        );
      }
    }

    public extractAlias (value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };

}