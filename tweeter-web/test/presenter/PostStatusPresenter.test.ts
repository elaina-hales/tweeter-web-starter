import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter"
import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito"
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
    let mockPostStatusPresenterView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockService: StatusService;

    const authToken = new AuthToken("abc123", Date.now());
    const post = "Hello world!";
    const postingStatusToastId = "123";
    const currentUser = new User("chris", "bacon", "crispy", "aURL");
    
    beforeEach(() => {
        mockPostStatusPresenterView = mock<PostStatusView>();
        const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);
        when(mockPostStatusPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusPresenterViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);
        
        mockService = mock<StatusService>();
        when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
    })

    it("tells the view to display a posting status message", async() => {
        await postStatusPresenter.submitPost(postingStatusToastId, post, currentUser, authToken);
        verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once();
    })

    it("calls postStatus on the post status service with the correct status string and auth token", async() => {
        await postStatusPresenter.submitPost(postingStatusToastId, post, currentUser, authToken);
        verify(mockService.postStatus(authToken, anything())).once();
    });

    it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when sucessful", async() => {
        await postStatusPresenter.submitPost(postingStatusToastId, post, currentUser, authToken);

        verify(mockPostStatusPresenterView.deleteMessage(anything())).once();
        verify(mockPostStatusPresenterView.setPost("")).once();
        verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();
        verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never();
    })

    it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsucessful", async() => {
        let error = new Error("An error occurred");
        when(mockService.postStatus(anything(), anything())).thenThrow(error);

        await postStatusPresenter.submitPost(postingStatusToastId, post, currentUser, authToken);
        verify(mockPostStatusPresenterView.deleteMessage(anything())).once();
        verify(mockPostStatusPresenterView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();

        verify(mockPostStatusPresenterView.setPost("")).never();
        verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).never();
    })

})