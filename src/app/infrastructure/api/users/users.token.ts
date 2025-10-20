import { InjectionToken } from '@angular/core';

export const USE_MOCK_USERS_API = new InjectionToken<boolean>(
  'USE_MOCK_USERS_API',
  {
    factory: () => false,
  },
);
