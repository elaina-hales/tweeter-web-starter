import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowRequest extends TweeterRequest{
    token: string, 
    userToFollow: UserDto
}