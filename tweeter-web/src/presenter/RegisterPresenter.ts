import { User, AuthToken } from "tweeter-shared";
import { AuthenticationView } from "./AuthenticationPresenter";
import { UserService } from "../model.service/UserService";
import { Buffer } from "buffer";

export const PAGE_SIZE = 10;
export interface RegisterView extends AuthenticationView {
  setImageUrl: any,
  setImageBytes: any,
  setImageFileExtension: any
}
export class RegisterPresenter {
  private service: UserService;
  private view: RegisterView;

  public constructor(view: RegisterView) {
    this.view = view;
    this.service = new UserService();
  }

  public async doRegister(
    alias: string,
    password: string,
    firstName: string,
    lastName: string,
    imageBytes: Uint8Array,
    imageFileExtension : string,
    rememberMe: boolean
  ) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension,
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  };
  
  public async handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  };
}