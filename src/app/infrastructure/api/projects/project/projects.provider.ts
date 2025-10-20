import { inject } from "@angular/core";
import { ProjectsApi } from "./projects.api";
import { USE_MOCK_PROJECTS_API } from "./projects.token";
import { ProjectsApiMock } from "./projects.api.mock";
import { ProjectsApiHttp } from "./projects.http.api";


export const PROJECTS_API_PROVIDER = {
    provide: ProjectsApi,
    useFactory: () => inject(USE_MOCK_PROJECTS_API) ? inject(ProjectsApiMock) : inject(ProjectsApiHttp),
};