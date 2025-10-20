import { InjectionToken } from '@angular/core';

export const USE_MOCK_PROJECT_HOURS_API = new InjectionToken<boolean>(
  'USE_MOCK_PROJECT_HOURS_API',
  {
    factory: () => false,
  },
);
