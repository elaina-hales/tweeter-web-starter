import { StatusService } from "../model.service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PostStatusView extends MessageView {
    setIsLoading: any,
    setPost: any
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private service: StatusService;

    public constructor(view: PostStatusView) {
        super(view);
        this.service = new StatusService();
    }

    public async submitPost(postingStatusToastId: string | void, post: string, currentUser: User, authToken: AuthToken) {
        await this.doFailureReortingOperation(async() => {
            this.view.setIsLoading(true);
            postingStatusToastId = this.view.displayInfoMessage(
                "Posting status...",
                0
            );

            const status = new Status(post, currentUser!, Date.now());

            await this.service.postStatus(authToken!, status);

            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        }, "post the status");
        this.view.deleteMessage(postingStatusToastId!);
        this.view.setIsLoading(false);
    }
}