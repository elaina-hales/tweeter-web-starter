import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
  private serverFacade = new ServerFacade;
  public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getUser({token: authToken.token, userAlias: alias});
  };

  public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    return this.serverFacade.login({alias: alias, password: password});
  };
    
  public async register (
    alias: string,
    password: string,
    firstName: string,
    lastName: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");
    return this.serverFacade.register({alias: alias, password: password, firstName: firstName, lastName: lastName, userImageBytes: imageStringBase64, imageFileExtension: imageFileExtension});
  }

  public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getIsFollower({token: authToken.token, user: user.dto, selectedUser: selectedUser.dto});
  };

  public async getFolloweeCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getFolloweeCount({user: user.dto, token: authToken.token});
  };

  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getFollowerCount({user: user.dto, token: authToken.token});
  };

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    return this.serverFacade.logout({token: authToken.token});
  };

  public async unfollow (
    authToken: AuthToken, 
    userToUnfollow: User
  ) : Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    return this.serverFacade.unfollow({token: authToken.token, userToUnfollow: userToUnfollow.dto})
  };

  public async follow (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    return this.serverFacade.follow({token: authToken.token, userToFollow: userToFollow.dto})
  };
}