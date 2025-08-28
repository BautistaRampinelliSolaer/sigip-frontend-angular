import { inject } from "@angular/core";
import { PlantCompanyApi } from "./plant-company.api";
import { PlantCompanyHttpApi, PlantCompanyMockApi } from "../../index";
import { USE_MOCK_PLANT_COMPANY_API } from "./plant-company.token";

export const PLANT_COMPANY_API_PROVIDER = {
    provide: PlantCompanyApi,
    useFactory: () => inject(USE_MOCK_PLANT_COMPANY_API) ? inject(PlantCompanyMockApi) : inject(PlantCompanyHttpApi),
};