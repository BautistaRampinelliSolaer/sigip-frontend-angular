import { inject } from "@angular/core";
import { UsersApi } from "./users.api";
import { USE_MOCK_USERS_API } from "./users.token";
import { UsersApiMock } from "./users.api.mock";
import { UsersApiHttp } from "./users.http.api";

export const PROJECT_HOURS_API_PROVIDER = {
  provide: UsersApi,
  useFactory: () =>
    inject(USE_MOCK_USERS_API) ? inject(UsersApiMock) : inject(UsersApiHttp),
};
