import { InjectionToken } from '@angular/core';

export const USE_MOCK_LIFECYCLE_API = new InjectionToken<boolean>('USE_MOCK_LIFECYCLE_API', {
  factory: () => false,
});
