import { InjectionToken } from "@angular/core";

export const USE_MOCK_CLIENT_CONTACT_API = new InjectionToken<boolean>('USE_MOCK_CLIENT_CONTACT_API', {
    factory: () => false,
});