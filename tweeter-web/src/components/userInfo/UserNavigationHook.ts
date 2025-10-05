import { useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";
import { useRef } from "react";
import { UserItemView, UserItemPresenter } from "../../presenter/UserItemPresenter";
import { UserInfoPresenter, UserInfoView } from "../../presenter/UserInfoPresenter";

export const useUserNavigation = () => {
    const { setDisplayedUser } = useUserInfoActions();
    const navigate = useNavigate();
    const { displayedUser, authToken } = useUserInfo();
    const { displayErrorMessage } = useMessageActions();

    const listener: UserInfoView = {
      displayErrorMessage: displayErrorMessage
    }
  
    const presenterRef = useRef<UserInfoPresenter | null>(null);
    if(!presenterRef.current){
      presenterRef.current = new UserInfoPresenter(listener);
    }
    
    const navigateToUser = async (event: React.MouseEvent, path: string): Promise<void> => {
        event.preventDefault();
    
        try {
          const alias = extractAlias(event.target.toString());
    
          const toUser = await presenterRef.current!.getUser(authToken!, alias);
    
          if (toUser) {
            if (!toUser.equals(displayedUser!)) {
              setDisplayedUser(toUser);
              navigate(`${path}/${toUser.alias}`);
            }
          }
        } catch (error) {
          displayErrorMessage(
            `Failed to get user because of exception: ${error}`,
          );
        }
    };
    
    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    return navigateToUser;
}
