import { GetFolloweeCountRequest, PagedUserItemRequest, RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../src/network/ServerFacade";
import "isomorphic-fetch";

describe("ServerFacade", () => {   
    let serverFacade: ServerFacade;

    beforeEach(() => {
        serverFacade = new ServerFacade;
    })

    it("registers correctly with the proper request ", async() => {
        let request: RegisterRequest = {
            alias: "cle",
            password: "men",
            firstName: "Clemen",
            lastName: "Tine",
            userImageBytes: "an image (pretend)",
            imageFileExtension: "duck.png"
        }
        const [user, authToken] = await serverFacade.register(request);
        expect(user.firstName).toBe("Allen");
        expect(authToken).not.toBeNull();
    })

    it("get page of 10 followers", async() => {
        let request: PagedUserItemRequest = {
            token: "cle",
            userAlias: "men",
            pageSize: 10,
            lastItem: null,
        }
        const [dtos, hasMore] = await serverFacade.getMoreFollowers(request);
        expect(dtos.length).toBe(10);
        expect(hasMore).toBe(true);
    });

    it("get followers count correctly", async() => {
        let request: GetFolloweeCountRequest = {
            token: "cle",
            user: { 
                firstName: "Allen",
                lastName: "Anderson",
                alias: "@allen",
                imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
            }
        }
        const numFollowees = await serverFacade.getFolloweeCount(request);
        expect(numFollowees).not.toBeNull();
        expect(numFollowees).toBeGreaterThan(0);
    });

})