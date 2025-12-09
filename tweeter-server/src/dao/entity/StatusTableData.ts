export class StatusTableData {
  handle: string
  timestamp: number
  post_text: string

  constructor(handle: string, timestamp: number, post_text: string) {
    this.handle = handle;
    this.timestamp = timestamp;
    this.post_text = post_text;
  }
}
