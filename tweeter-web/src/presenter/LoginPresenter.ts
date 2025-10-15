import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface LoginView extends View {
    setIsLoading: any,
    navigate: any,
    updateUserInfo: any
}

export class LoginPresenter extends Presenter<LoginView> {
    private service: UserService;

    public constructor(view: LoginView) {
        super(view);
        this.service = new UserService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string | undefined) {
        await this.doFailureReortingOperation(async() => {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.service.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate(`/feed/${user.alias}`);
            }
        }, "log user in");
        this.view.setIsLoading(false);
    }
}