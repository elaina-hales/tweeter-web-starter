export class UserTableData {
  password: string;
  first_name: string;
  last_name: string; 
  image_url: string;
  follower_count: number; 
  followee_count: number;
  handle: string;

  constructor(handle: string, password: string, first_name: string, last_name: string, image_url: string, follower_count: number, followee_count: number) {
    this.handle = handle;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.image_url = image_url;
    this.follower_count = follower_count;
    this.followee_count = followee_count;
  }
}
