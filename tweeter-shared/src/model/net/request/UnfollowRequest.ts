import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface UnfollowRequest extends TweeterRequest{
    token: string, 
    userToUnfollow: UserDto
}