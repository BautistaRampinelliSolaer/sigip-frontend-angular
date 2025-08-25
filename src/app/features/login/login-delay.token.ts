import { InjectionToken } from "@angular/core";

export const LOGIN_NAV_DELAY_MS = new InjectionToken<number>(
    'LOGIN_NAV_DELAY_MS',
    {
        providedIn: 'root',
        factory: () => 500,
    }
);