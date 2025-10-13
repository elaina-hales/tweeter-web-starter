import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AuthenticationView {
    displayErrorMessage: (message: string) => void;
    setIsLoading: any;
    navigate: any;
    updateUserInfo: any;
}

export abstract class AuthenticationPresenter {
    protected _view: AuthenticationView;
    private userService: UserService;

    protected constructor(view: AuthenticationView){
        this._view = view;
        this.userService = new UserService();
    }
}