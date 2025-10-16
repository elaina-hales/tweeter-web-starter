import { UserService } from "../model.service/UserService";
import { AuthenticationPresenter } from "./AuthenticationPresenter";
import { AuthenticationView } from "./Presenter";

export const PAGE_SIZE = 10;

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
    private service: UserService;

    public constructor(view: AuthenticationView) {
        super(view);
        this.service = new UserService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string | undefined) {
        await this.doFailureReortingOperation(async() => {
            await this.authenticate(this.service.login(alias, password), rememberMe, originalUrl);
        }, "log user in");
        this.view.setIsLoading(false);
    }
}