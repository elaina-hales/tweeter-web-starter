import { Link, useNavigate, useParams } from "react-router-dom";
import Post from "./Post";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { useContext } from "react";
import { UserInfoContext, UserInfoActionsContext } from "../userInfo/UserInfoContexts";
import { useMessageActions } from "../toaster/MessageHooks";

interface Props {
    user: User
    formattedDate: string,
    status: Status
    featureURL: string
}

const StatusItem = (props: Props) => {
    const { displayedUser, authToken } = useContext(UserInfoContext);
    const { setDisplayedUser } = useContext(UserInfoActionsContext);
    const navigate = useNavigate();
    const { displayErrorMessage } = useMessageActions();
    
    
    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
    
        try {
          const alias = extractAlias(event.target.toString());
    
          const toUser = await getUser(authToken!, alias);
    
          if (toUser) {
            if (!toUser.equals(displayedUser!)) {
              setDisplayedUser(toUser);
              navigate(`/story/${toUser.alias}`);
            }
          }
        } catch (error) {
          displayErrorMessage(
            `Failed to get user because of exception: ${error}`
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

    return (
        <div className="col bg-light mx-0 px-0">
            <div className="container px-0">
                <div className="row mx-0 px-0">
                    <div className="col-auto p-3">
                        <img
                            src={props.user.imageUrl}
                            className="img-fluid"
                            width="80"
                            alt="Posting user"
                        />
                    </div>
                    <div className="col">
                    <h2>
                        <b>
                        {props.user.firstName} {props.user.lastName}
                        </b>{" "}
                        -{" "}
                        <Link
                            to={`${props.featureURL}/${props.user.alias}`}
                            onClick={navigateToUser}
                        >
                            {props.user.alias}
                        </Link>
                    </h2>
                    {props.formattedDate}
                    <br />
                    <Post status={props.status} featurePath={props.featureURL} />
                    </div>
                </div>
            </div>
        </div>
    );

}

export default StatusItem;