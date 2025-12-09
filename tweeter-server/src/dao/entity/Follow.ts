export class FollowTableData {
  followee_handle: string
  follower_handle: string

  constructor(follower_handle: string, followee_handle: string) {
    this.followee_handle = followee_handle;
    this.follower_handle = follower_handle;
  }
}
