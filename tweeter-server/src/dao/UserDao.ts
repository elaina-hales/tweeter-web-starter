import { User } from "tweeter-shared";
import { UserTableData } from "./entity/UserTableData";

export interface UserDao {
    getUser(alias: string): Promise<UserTableData | null>;
    putUser(user: UserTableData) : Promise<User>;
    updateFollowerCount(alias: string, value: number): Promise<void>
    updateFolloweeCount(alias: string, value: number): Promise<void>
}