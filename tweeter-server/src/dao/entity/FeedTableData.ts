import { StatusTableData } from "./StatusTableData";

export class FeedTableData extends StatusTableData {
  followerAlias: string

  constructor(handle: string, timestamp: number, post_text: string, followerAlias: string) {
    super(handle, timestamp, post_text);
    this.followerAlias = followerAlias;
  }
}
