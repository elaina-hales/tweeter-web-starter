import { UserService } from "../model.service/UserService";
import { View, Presenter } from "./Presenter";

export interface AuthenticationView extends View {
    setIsLoading: any,
    navigate: any,
    updateUserInfo: any
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
    private userService: UserService;

    protected constructor(view: AuthenticationView){
        super(view);
        this.userService = new UserService();
    }
}