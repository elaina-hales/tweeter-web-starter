import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export class RegisterPresenter extends AuthenticationPresenter {
    private service: UserService;

    public constructor(view: AuthenticationView) {
        super(view);
        this.service = new UserService();
    }

    public async register (
        alias: string,
        password: string,
        firstName: string,
        lastName: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
      ): Promise<[User, AuthToken]> {
        return this.service.register(alias, password, firstName, lastName, userImageBytes, imageFileExtension);
    };
}