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
            // why does mine in here look different?
            // set is loading is gone, instead of updateuserinfo its authenticated?
            // what should I do with try catch finally blocks?
            this.view.setIsLoading(true);

            const [user, authToken] = await this.service.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate(`/feed/${user.alias}`);
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        } finally {
            this.view.setIsLoading(false);
        }
    }
}