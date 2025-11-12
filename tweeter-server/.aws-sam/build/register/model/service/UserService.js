"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const buffer_1 = require("buffer");
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async getUser(token, alias) {
        // TODO: Replace with the result of calling server
        const user = tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
        if (user == null) {
            return null;
        }
        return user.dto;
    }
    ;
    async login(alias, password) {
        // TODO: Replace with the result of calling the server
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        return [user, tweeter_shared_1.FakeData.instance.authToken];
    }
    ;
    async register(alias, password, firstName, lastName, userImageBytes, imageFileExtension) {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64 = buffer_1.Buffer.from(userImageBytes).toString("base64");
        // TODO: Replace with the result of calling the server
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid registration");
        }
        return [user, tweeter_shared_1.FakeData.instance.authToken];
    }
    ;
    async getIsFollowerStatus(authToken, user, selectedUser) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
    ;
    async getFolloweeCount(authToken, user) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(user.alias);
    }
    ;
    async getFollowerCount(authToken, user) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.getFollowerCount(user.alias);
    }
    ;
    async logout(authToken) {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
    }
    ;
    async unfollow(authToken, userToUnfollow) {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
        return [followerCount, followeeCount];
    }
    ;
    async follow(authToken, userToFollow) {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(authToken, userToFollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
        return [followerCount, followeeCount];
    }
    ;
}
exports.UserService = UserService;
