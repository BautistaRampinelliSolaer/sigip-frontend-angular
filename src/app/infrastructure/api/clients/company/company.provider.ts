import { inject } from "@angular/core";
import { CompanyApi } from "./company.api";
import { USE_MOCK_COMPANY_API } from "./company.token";
import { CompanyHttpApi, CompanyMockApi } from "@app/infrastructure/api/index";

export const COMPANY_API_PROVIDER = {
    provide: CompanyApi,
    useFactory: () => inject(USE_MOCK_COMPANY_API) ? inject(CompanyMockApi) : inject(CompanyHttpApi),
};