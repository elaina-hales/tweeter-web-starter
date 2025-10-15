import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface NavigationView extends View {
  displayErrorMessage: (message: string) => void,
  navigate: any,
  setDisplayedUser: any
}

export class NavigationPresenter extends Presenter<NavigationView> {
    private service: UserService;

    public constructor(view: NavigationView) {
        super(view);
        this.service = new UserService();
    }

    public async navigateToUser (event: React.MouseEvent, path: string, authToken: AuthToken, displayedUser: User): Promise<void> {
      await this.doFailureReortingOperation(async() => {
        const alias = this.extractAlias(event.target.toString());
  
        const toUser = await this.service.getUser(authToken!, alias);
  
        if (toUser) {
          if (!toUser.equals(displayedUser!)) {
            this.view.setDisplayedUser(toUser);
            this.view.navigate(`${path}/${toUser.alias}`);
          }
        }
      }, "get user")
    }

    public extractAlias (value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };

}