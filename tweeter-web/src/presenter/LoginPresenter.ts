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

    public async login (
        alias: string,
        password: string
      ): Promise<[User, AuthToken]> {
        return this.service.login(alias, password);
    };
}