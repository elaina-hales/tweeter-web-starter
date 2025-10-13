import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";
import { useRef } from "react";
import { NavigationPresenter, NavigationView } from "../../presenter/NavigationPresenter";

export const useUserNavigation = () => {
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const { displayedUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useMessageActions();

  const listener: NavigationView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
    navigate: navigate
  }

  const presenterRef = useRef<NavigationPresenter | null>(null);
  if(!presenterRef.current){
    presenterRef.current = new NavigationPresenter(listener);
  }
  
  const navigateToUser = async (event: React.MouseEvent, path: string): Promise<void> => {
    event.preventDefault();
    presenterRef.current!.navigateToUser(event, path, authToken!, displayedUser!);
  };

  return navigateToUser;
}
