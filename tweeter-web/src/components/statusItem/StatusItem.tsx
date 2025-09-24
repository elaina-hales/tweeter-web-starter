import { Link } from "react-router-dom";
import Post from "./Post";
import { Status, User } from "tweeter-shared";
import { useUserNavigation } from "../userInfo/UserNavigationHook";

interface Props {
    user: User
    formattedDate: string,
    status: Status
    featureURL: string
}

const StatusItem = (props: Props) => {
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
                            onClick={(event) => useUserNavigation(event, props.featureURL)}
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