import { User, UserDto } from "tweeter-shared";
import { UserTableData } from "./entity/UserTableData";

export interface UserDao {
    getUser(alias: string): Promise<UserDto | null>;
    putUser(user: UserTableData) : Promise<User>;
}