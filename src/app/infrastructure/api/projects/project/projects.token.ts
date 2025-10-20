import { InjectionToken } from '@angular/core';

export const USE_MOCK_PROJECTS_API = new InjectionToken<boolean>('USE_MOCK_PROJECTS_API', {
  factory: () => false,
});
