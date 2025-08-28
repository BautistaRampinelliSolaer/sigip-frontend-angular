import { InjectionToken } from '@angular/core';
export interface AppEnv { apiUrl: string }
export const ENV = new InjectionToken<AppEnv>('ENV');