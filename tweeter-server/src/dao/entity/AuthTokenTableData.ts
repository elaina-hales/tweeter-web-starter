export class AuthTokenTableData {
  authtoken: string;
  user_alias: string;
  timestamp: number; 

  constructor(authtoken: string, user_alias: string, timestamp: number) {
    this.authtoken = authtoken;
    this.user_alias = user_alias;
    this.timestamp = timestamp;
  }
}
