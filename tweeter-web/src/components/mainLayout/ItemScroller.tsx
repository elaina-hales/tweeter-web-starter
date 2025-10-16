import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PageItemPresenter, PageItemView } from "../../presenter/PageItemPresenter";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { Service } from "../../model.service/Service";

export interface Props<T, U extends Service> {
    featureUrl: string,
    presenterFactory: (view: PageItemView<T>) => PageItemPresenter<T, U>,
    itemFactory: (item: T, featureUrl: string) => JSX.Element
}

export const ItemScroller = <A, U extends Service>(props: Props<A, U>) => {
    const { displayErrorMessage } = useMessageActions();
    const [items, setItems] = useState<A[]>([]);

    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();
    const { displayedUser: displayedUserAliasParam } = useParams();

    const listener: PageItemView<A> = {
        addItems: (newItems: A[]) =>
            setItems((previousItems) => [...previousItems, ...newItems]),
        displayErrorMessage: displayErrorMessage
    }
  
    const presenterRef = useRef<PageItemPresenter<A, U> | null>(null);
    if(!presenterRef.current){
        presenterRef.current = props.presenterFactory(listener);
    }

    // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
    useEffect(() => {
        if (
        authToken &&
        displayedUserAliasParam &&
        displayedUserAliasParam != displayedUser!.alias
        ) {
        presenterRef.current!.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
            if (toUser) {
            setDisplayedUser(toUser);
            }
        });
        }
    }, [displayedUserAliasParam]);

    // Initialize the component whenever the displayed user changes
    useEffect(() => {
        reset();
        loadMoreItems();
    }, [displayedUser]);

    const reset = async () => {
        setItems(() => []);
        presenterRef.current!.reset();
    };

    const loadMoreItems = async () => {
        presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
    };

    return (
        <div className="container px-0 overflow-visible vh-100">
        <InfiniteScroll
            className="pr-0 mr-0"
            dataLength={items.length}
            next={loadMoreItems}
            hasMore={presenterRef.current!.hasMoreItems}
            loader={<h4>Loading...</h4>}>

            {items.map((item, index) => (
            <div
                key={index}
                className="row mb-3 mx-0 px-0 border rounded bg-white"
            >
            {props.itemFactory(item, props.featureUrl)}
            </div>
            ))}
        </InfiniteScroll> 
        </div>
    );
}