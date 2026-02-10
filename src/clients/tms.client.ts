import {
  ApiClient,
  ProjectSectionsApi,
  WorkItemsApi,
  SectionModel,
  WorkItemShortApiResult,
  WorkItemModel,
} from "testit-api-client";
import { ITmsClient } from "./tms.client.type";
import { handleHttpError } from "./tms.client.handler";

export class TmsClient implements ITmsClient {
  private readonly projectSectionsApi: ProjectSectionsApi;
  private readonly workItemsApi: WorkItemsApi;

  constructor(url: string, token: string) {
    const defaultClient = ApiClient.instance;
    defaultClient.basePath = url;
    const auth = defaultClient.authentications["Bearer or PrivateToken"];
    auth.apiKeyPrefix = "PrivateToken";
    auth.apiKey = token;

    this.projectSectionsApi = new ProjectSectionsApi();
    this.workItemsApi = new WorkItemsApi();
  }

  public async getSectionsByProjectId(id: string): Promise<Array<SectionModel>> {
    return await this.projectSectionsApi
      .getSectionsByProjectId(id, {} as any)
      .then((response) => response)
      .catch((err) => {
        handleHttpError(err);

        return [];
      });
  }

  public async getWorkItemsBySectionId(id: string): Promise<Array<WorkItemShortApiResult>> {
    if (id === undefined || id === "") {
      return [];
    }

    const filter = {
      sectionIds: [id],
      isDeleted: false,
    };
    const request = {
      filter: filter
    };

    return await this.workItemsApi
      .apiV2WorkItemsSearchPost({workItemSelectApiModel: request} as any)
      .then((response) => response)
      .catch((err) => {
        handleHttpError(err);

        return [];
      });
  }

  public async getWorkItemById(id: string): Promise<WorkItemModel|undefined> {
    return await this.workItemsApi
      .getWorkItemById(id, {} as any)
      .then((response) => response)
      .catch((err) => {
        handleHttpError(err);

        return undefined;
      });
  }
}
