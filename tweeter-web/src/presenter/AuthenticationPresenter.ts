import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AuthenticationView {
    displayErrorMessage: (message: string) => void;
}

export abstract class AuthenticationPresenter {
    private _view: AuthenticationView;
    private userService: UserService;

    protected constructor(view: AuthenticationView){
        this._view = view;
        this.userService = new UserService();
    }

    public async loginOrRegister (
        alias: string,
        password: string,
        firstName: string | null,
        lastName: string | null,
        imageBytes: Uint8Array | null,
        imageFileExtension : string | null,
        isRegister: boolean
    ): Promise<[User, AuthToken]> {
        if (isRegister) {
            return this.userService.register(alias, password, firstName!, lastName!, imageBytes!, imageFileExtension!);
        } else {
            return this.userService.login(alias, password);
        }
    };   
}