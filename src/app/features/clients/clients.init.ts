import { provideEnvironmentInitializer, inject } from '@angular/core';
import { CompanyRepo } from './state/repos/company.repo';
import { PlantCompanyRepo } from './state/repos/plant-company.repo';
import { ClientContactRepo } from './state/repos/client-contact.repo';

export function provideClientsInit() {
  return provideEnvironmentInitializer(() => {
    const companies = inject(CompanyRepo);
    const plants = inject(PlantCompanyRepo);
    const contacts = inject(ClientContactRepo);

    companies.loadAll();
    plants.loadAll();
    contacts.loadAll();
  });
}
