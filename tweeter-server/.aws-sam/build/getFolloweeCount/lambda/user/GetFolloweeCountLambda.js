"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const numFollowees = await userService.getFolloweeCount(request.token, request.user);
    return {
        success: true,
        message: null,
        numFollowees: numFollowees
    };
};
exports.handler = handler;
