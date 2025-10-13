import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export class LoginPresenter extends AuthenticationPresenter {
    private service: UserService;

    public constructor(view: AuthenticationView) {
        super(view);
        this.service = new UserService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string | undefined) {
        try {
            this._view.setIsLoading(true);
            // need to get login working here
            const [user, authToken] = await this.login(alias, password);

            this._view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
                this._view.navigate(originalUrl);
            } else {
                this._view.navigate(`/feed/${user.alias}`);
            }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
        );
        } finally {
            this._view.setIsLoading(false);
        }
    }

    public async login(
        alias: string,
        password: string,
    ): Promise<[User, AuthToken]> {
        return this.service.login(alias, password);
    };   
}