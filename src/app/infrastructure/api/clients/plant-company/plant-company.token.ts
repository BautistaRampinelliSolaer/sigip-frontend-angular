import { InjectionToken } from "@angular/core";

export const USE_MOCK_PLANT_COMPANY_API = new InjectionToken<boolean>('USE_MOCK_PLANT_COMPANY_API', {
    factory: () => false,
});