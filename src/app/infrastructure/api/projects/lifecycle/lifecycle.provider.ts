import { inject } from "@angular/core";
import { USE_MOCK_LIFECYCLE_API } from "./lifecycle.token";
import { LifecycleApi } from "./lifecycle.api";
import { ProjectsApiHttp } from "../project/projects.http.api";
import { ProjectsApiMock } from "../project/projects.api.mock";

export const LIFECYLCE_API_PROVIDER = {
    provide: LifecycleApi,
    useFactory: () => inject(USE_MOCK_LIFECYCLE_API) ? inject(ProjectsApiMock) : inject(ProjectsApiHttp),
};