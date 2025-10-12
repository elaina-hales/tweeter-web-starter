import { AuthToken } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export class LogoutPresenter extends AuthenticationPresenter {
    private service: UserService;

    public constructor(view: AuthenticationView) {
        super(view);
        this.service = new UserService();
    }

    public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
    };
}