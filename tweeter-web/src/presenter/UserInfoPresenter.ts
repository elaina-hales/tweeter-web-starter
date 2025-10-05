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

}