import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, AuthenticationView } from "./Presenter";
import { RegisterView } from "./RegisterPresenter";

export abstract class AuthenticationPresenter<V extends AuthenticationView | RegisterView> extends Presenter<V> {
    private userService: UserService;

    protected constructor(view: V){
        super(view);
        this.userService = new UserService();
    }

    protected async authenticate(operation: Promise<[User, AuthToken]>, rememberMe: boolean, originalUrl: string | undefined) : Promise<void>{
        this.view.setIsLoading(true);

        const [user, authToken] = await operation;

        this.view.updateUserInfo(user, user, authToken, rememberMe);
        if (!!originalUrl) {
            this.view.navigate(originalUrl);
        } else {
            this.view.navigate(`/feed/${user.alias}`);
        }
    }
}