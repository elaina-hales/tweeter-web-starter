import { AuthDto } from "../../dto/AuthDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface RegisterResponse extends TweeterResponse {
    readonly user: UserDto,
    readonly token: AuthDto
}