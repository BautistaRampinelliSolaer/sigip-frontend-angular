import { Provider } from '@angular/core';
import { ProjectState } from './state/project-state';

export function provideProjectsState(): Provider[] {
  return [ProjectState];
}
