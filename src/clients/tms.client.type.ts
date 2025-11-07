import { SectionModel, WorkItemShortApiResult, WorkItemModel } from "testit-api-client";

export interface ITmsClient {
  getSectionsByProjectId(id: string): Promise<Array<SectionModel>>;
  getWorkItemsBySectionId(id: string): Promise<Array<WorkItemShortApiResult>>;
  getWorkItemById(id: string): Promise<WorkItemModel|undefined>;
}
