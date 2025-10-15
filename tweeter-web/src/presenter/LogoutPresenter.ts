import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface LogoutView extends MessageView {
    clearUserInfo: any,
    navigate: any,
}
export class LogoutPresenter extends Presenter<LogoutView> {
    private service: UserService;

    public constructor(view: LogoutView) {
        super(view);
        this.service = new UserService();
    }

    public async logout(authToken: AuthToken): Promise<void> {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
        await this.doFailureReortingOperation(async() => {
            await this.service.logout(authToken!);
            this.view.deleteMessage(loggingOutToastId!);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        }, "log user out");
    };
}