import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { anything, instance, mock, verify } from "@typestrong/ts-mockito"
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter, PostStatusView } from "../../../src/presenter/PostStatusPresenter";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));      

describe("PostStatus Component", () => {
    beforeAll(() => {
        const mockUserInstance = mock<User>();
        const mockAuthTokenInstance = mock<AuthToken>();

        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
        });      
    })
    
    it("starts with the post status and clear buttons disabled", () => {
        const { postStatusButton, clearButton  } = renderPostStatusAndGetElement("/");
        expect( postStatusButton ).toBeDisabled();
        expect( clearButton ).toBeDisabled();
    });

    it("enables post status and clear buttons when text field has text", async() => {
        const { user, postStatusTextArea, postStatusButton, clearButton } = renderPostStatusAndGetElement("/");
        
        await user.type(postStatusTextArea, "Hello World!");

        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();

    });

    it("disables post status and clear buttons when text field is cleared", async () =>{
        const { user, postStatusTextArea, postStatusButton, clearButton } = renderPostStatusAndGetElement("/");
        
        await user.type(postStatusTextArea, "Hello World!");
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();

        await user.clear(postStatusTextArea);
        expect(clearButton).toBeDisabled();
        expect(postStatusButton).toBeDisabled();

    });

    it("calls the presenter's postStatus method with correct parameters when the Post Status button is pressed", async() => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const text = "Hello World!";

        const { user, postStatusTextArea, postStatusButton } = renderPostStatusAndGetElement("/", mockPresenterInstance);

        await user.type(postStatusTextArea, text);
        await user.click(postStatusButton);
        
        verify(mockPresenter.submitPost(anything(), text, anything(), anything())).once();
    });
})

function renderPostStatus(presenter?: PostStatusPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <PostStatus presenterFactory={(view: PostStatusView) => presenter}/>
            ) : (
                <PostStatus presenterFactory={(view: PostStatusView) => new PostStatusPresenter(view)}/>
            )}
        </MemoryRouter>
    );
}

function renderPostStatusAndGetElement(originalURL: string, presenter?: PostStatusPresenter) {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const postStatusTextArea = screen.getByLabelText("postStatusTextArea");
    const postStatusButton = screen.getByLabelText("postStatusButton");
    const clearButton = screen.getByLabelText("clearStatusButton");


    return { user, postStatusTextArea, postStatusButton, clearButton };
}