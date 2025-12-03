import { UserDto } from "tweeter-shared";

export interface UserDao {
    getUser(alias: string): Promise<UserDto | null>;
}