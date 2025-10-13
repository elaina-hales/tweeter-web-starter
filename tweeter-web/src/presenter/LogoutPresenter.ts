import { AuthToken } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export interface LogoutView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    deleteMessage: (messageId: string) => void;
    clearUserInfo: any,
    navigate: any,
}
export class LogoutPresenter {
    private service: UserService;
    private view: LogoutView;

    public constructor(view: LogoutView) {
        this.service = new UserService();
        this.view = view
    }

    public async logout(authToken: AuthToken): Promise<void> {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

        try {
            await this.service.logout(authToken!);
            this.view.deleteMessage(loggingOutToastId!);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user out because of exception: ${error}`,
            );
        }
    };
}