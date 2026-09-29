import { SectionModel, WorkItemShortApiResult, WorkItemApiResult } from "../adaptersapi/index.js";

export interface ITmsClient {
  getSectionsByProjectId(id: string): Promise<Array<SectionModel>>;
  getWorkItemsBySectionId(id: string): Promise<Array<WorkItemShortApiResult>>;
  getWorkItemById(id: string): Promise<WorkItemApiResult|undefined>;
}
