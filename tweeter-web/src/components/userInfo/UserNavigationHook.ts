import { useNavigate } from "react-router-dom";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";

export const useUserNavigation = () => {
    const { setDisplayedUser } = useUserInfoActions();
    const navigate = useNavigate();
    const { displayedUser, authToken } = useUserInfo();
    const { displayErrorMessage } = useMessageActions();
    
    const navigateToUser = async (event: React.MouseEvent, path: string): Promise<void> => {
        event.preventDefault();
    
        try {
          const alias = extractAlias(event.target.toString());
    
          const toUser = await getUser(authToken!, alias);
    
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
    
    const getUser = async (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    return navigateToUser;
}
