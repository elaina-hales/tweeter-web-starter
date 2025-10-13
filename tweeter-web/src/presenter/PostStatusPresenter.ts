import { StatusService } from "../model.service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

export const PAGE_SIZE = 10;

export interface PostStatusView {
    displayErrorMessage: (message: string) => void,
    displayInfoMessage: (message: string, duration: number) => void,
    deleteMessage: (messageId: string) => void,
    setIsLoading: any,
    setPost: any
}

export class PostStatusPresenter {
    private service: StatusService;
    private view: PostStatusView;

    public constructor(view: PostStatusView) {
        this.service = new StatusService();
        this.view = view;
    }

    public async submitPost(postingStatusToastId: string | void, post: string, currentUser: User, authToken: AuthToken) {
        try {
            this.view.setIsLoading(true);
            postingStatusToastId = this.view.displayInfoMessage(
                "Posting status...",
                0
            );

            const status = new Status(post, currentUser!, Date.now());

            await this.service.postStatus(authToken!, status);

            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`,
            );
        } finally {
            this.view.deleteMessage(postingStatusToastId!);
            this.view.setIsLoading(false);
        }
    }
}