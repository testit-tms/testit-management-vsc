import {
  ApiClient,
  ProjectSectionsApi,
  WorkItemsApi,
  SectionModel,
  WorkItemShortApiResult,
  WorkItemApiResult,
} from "../adaptersapi/index.js";
import { ITmsClient } from "./tms.client.type";
import { handleHttpError } from "./tms.client.handler";

export class TmsClient implements ITmsClient {
  private readonly projectSectionsApi: ProjectSectionsApi;
  private readonly workItemsApi: WorkItemsApi;

  constructor(url: string, token: string) {
    const defaultClient = ApiClient.instance;
    defaultClient.basePath = url;
    const auth = defaultClient.authentications["PrivateToken"];
    auth.apiKeyPrefix = "PrivateToken";
    auth.apiKey = token;

    this.projectSectionsApi = new ProjectSectionsApi();
    this.workItemsApi = new WorkItemsApi();
  }

  public async getSectionsByProjectId(id: string): Promise<Array<SectionModel>> {
    return await this.projectSectionsApi
      .adaptersProjectsProjectIdSectionsGet(id, {} as any)
      .then((response: Array<SectionModel>) => response)
      .catch((err: unknown) => {
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
      .adaptersWorkItemsSearchPost({workItemSelectApiModel: request} as any)
      .then((response: Array<WorkItemShortApiResult>) => response)
      .catch((err: unknown) => {
        handleHttpError(err);

        return [];
      });
  }

  public async getWorkItemById(id: string): Promise<WorkItemApiResult|undefined> {
    return await this.workItemsApi
      .adaptersWorkItemsIdGet(id, {} as any)
      .then((response: WorkItemApiResult) => response)
      .catch((err: unknown) => {
        handleHttpError(err);

        return undefined;
      });
  }
}
