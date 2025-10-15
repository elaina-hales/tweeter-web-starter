import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View {
    addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
    private _hasMoreItems = true;
    private _lastItem: Status | null = null;
    private userService: UserService;

    protected constructor(view: StatusItemView){
        super(view);
        this.userService = new UserService();
    }

    protected get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value;
    }

    protected set hasMoreItems(value: boolean){
        this._hasMoreItems = value;
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    reset() {
        this.lastItem = null;
        this.hasMoreItems = true;
        throw new Error("Method not implemented.");
    }

    public async getUser (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    };

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string) : void
}