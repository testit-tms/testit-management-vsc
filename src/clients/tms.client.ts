import { 
  ProjectsApi,
  ProjectSectionsApi,
  WorkItemsApi,
  SectionModel,
  WorkItemShortApiResult,
  WorkItemModel,
  ProjectsApiApiKeys,
  ProjectSectionsApiApiKeys,
  WorkItemsApiApiKeys,
  WorkItemFilterApiModel,
  WorkItemSelectApiModel,
} from "testit-api-client";
import { ITmsClient } from "./tms.client.type";
import { handleHttpError } from "./tms.client.handler";

export class TmsClient implements ITmsClient {
  private projectsApi: ProjectsApi;
  private projectSectionsApi: ProjectSectionsApi;
  private workItemsApi: WorkItemsApi;

  constructor(url: string, token: string) {
    this.projectsApi = this.buildProjectsApi(url, token);
    this.projectSectionsApi = this.buildProjectSectionsApi(url, token);
    this.workItemsApi = this.buildWorkItemsApi(url, token);
  }

  private buildProjectsApi(url: string, token: string): ProjectsApi {
    const projectsApi = new ProjectsApi(url);
    const projectsApiApiKeys = ProjectsApiApiKeys["Bearer or PrivateToken"];
    projectsApi.setApiKey(projectsApiApiKeys, `PrivateToken ${token}`);

    return projectsApi;
  }

  private buildProjectSectionsApi(url: string, token: string): ProjectSectionsApi {
    const projectSectionsApi = new ProjectSectionsApi(url);
    const projectSectionsApiApiKeys = ProjectSectionsApiApiKeys["Bearer or PrivateToken"];
    projectSectionsApi.setApiKey(projectSectionsApiApiKeys, `PrivateToken ${token}`);

    return projectSectionsApi;
  }

  private buildWorkItemsApi(url: string, token: string): WorkItemsApi {
    const workItemsApi = new WorkItemsApi(url);
    const workItemsApiApiKeys = WorkItemsApiApiKeys["Bearer or PrivateToken"];
    workItemsApi.setApiKey(workItemsApiApiKeys, `PrivateToken ${token}`);

    return workItemsApi;
  }

  public async getSectionsByProjectId(id: string): Promise<Array<SectionModel>> {
    return await this.projectSectionsApi
      .getSectionsByProjectId(id)
      .then((response) => response.body)
      .catch((err) => {
        handleHttpError(err);

        return [];
      });
  }

    public async getSectionsByParentSectionId(id: string): Promise<Array<SectionModel>> {
    return await this.projectSectionsApi
      .getSectionsByProjectId(id)
      .then((response) => response.body)
      .catch((err) => {
        handleHttpError(err);

        return [];
      });
  }

  public async getWorkItemsBySectionId(id: string): Promise<Array<WorkItemShortApiResult>> {
    if (id === undefined || id === "") {
      return [];
    }

    const filter: WorkItemFilterApiModel = {
      sectionIds: [id],
      isDeleted: false,
    };
    const request: WorkItemSelectApiModel = {
      filter: filter
    }

    return await this.workItemsApi
      .apiV2WorkItemsSearchPost(undefined, undefined, undefined, undefined, undefined, request)
      .then((response) => response.body)
      .catch((err) => {
        handleHttpError(err);

        return [];
      });
  }

  public async getWorkItemById(id: string): Promise<WorkItemModel|undefined> {
    return await this.workItemsApi
      .getWorkItemById(id)
      .then((response) => response.body)
      .catch((err) => {
        handleHttpError(err);

        return undefined;
      });
  }
}
