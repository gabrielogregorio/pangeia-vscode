class DataTags {
  tags: string[][];
  hasResponse: boolean;
  lastUpdateTags: string;

  constructor() {
    this.tags = [];
    this.hasResponse = false;
    this.lastUpdateTags = this.getCurrentTime();
  }

  private getCurrentTime() {
    return new Date().getTime().toString();
  }

  private updateLastUpdateTagsDate() {
    this.lastUpdateTags = this.getCurrentTime();
  }

  setData(tags: string[][]): void {
    this.updateLastUpdateTagsDate();
    this.tags = tags;
  }

  getData(): string[][] {
    return this.tags;
  }

  getHasResponse(): boolean {
    return this.hasResponse;
  }

  setHasResponse(hasResponse: boolean): void {
    this.hasResponse = hasResponse;
  }
}

export const mainDataTags = new DataTags();
