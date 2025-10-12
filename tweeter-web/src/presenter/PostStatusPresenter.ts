import { StatusService } from "../model.service/StatusService";
import { AuthToken, Status } from "tweeter-shared";

export const PAGE_SIZE = 10;

export class PostStatusPresenter {
    private service: StatusService;

    public constructor() {
        this.service = new StatusService();
    }

    public postStatus(authToken: AuthToken, newStatus: Status) {
        return this.service.postStatus(authToken, newStatus);
    }
}