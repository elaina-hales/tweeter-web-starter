import { AuthenticationPresenter } from "./AuthenticationPresenter";
import { UserService } from "../model.service/UserService";
import { Buffer } from "buffer";
import { AuthenticationView } from "./Presenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (url: string) => void,
  setImageBytes: any,
  setImageFileExtension: (fileExtension: string) => void
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  private service = new UserService();

  public constructor(view: RegisterView) {
    super(view);
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
    await this.doFailureReortingOperation(async () => {
      await this.authenticate(this.service.register(alias, password, firstName, lastName, imageBytes, imageFileExtension), rememberMe, undefined);
    }, "register user");
    this.view.setIsLoading(false);
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