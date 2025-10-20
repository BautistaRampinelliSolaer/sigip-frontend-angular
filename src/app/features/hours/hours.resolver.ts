import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProjectHoursUiStore } from './ui/stores/project-hours-ui.store';

export const projectHoursPresetResolver: ResolveFn<true> = (route) => {
  const ui = inject(ProjectHoursUiStore);

  // Path params
  const projectIdParam = route.paramMap.get('projectId');
  ui.setProject(projectIdParam ? Number(projectIdParam) : null);

  // Query params
  const qp = route.queryParamMap;
  const userId = qp.get('userId');
  ui.setUser(userId ? Number(userId) : null);

  const from = qp.get('from');
  const to = qp.get('to');
  ui.setDates(from, to);

  const q = qp.get('q') ?? '';
  ui.setSearch(q);

  const sort = qp.get('sort') as 'workDate' | 'workedHours' | null;
  const dir = (qp.get('dir') as 'asc' | 'desc' | null) ?? 'desc';
  if (sort) ui.setSort(sort, dir);

  return true;
};
