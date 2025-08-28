import { computed, inject, Injectable, signal } from '@angular/core';
import { CompanyRepo } from './repos/company.repo';
import { PlantCompanyRepo } from './repos/plant-company.repo';
import { ClientContactRepo } from './repos/client-contact.repo';

export type ClientsTab = 'companies' | 'plants' | 'contacts';
export type DetailKind = 'company' | 'plant' | 'contact' | null;

// Single Source of Truth for UI State
@Injectable({
  providedIn: 'root',
})
export class ClientsUiStore {
  private readonly companies = inject(CompanyRepo);
  private readonly plants = inject(PlantCompanyRepo);
  private readonly contacts = inject(ClientContactRepo);

  readonly activeTab = signal<ClientsTab>('companies');

  readonly selectedCompanyId = signal<number | null>(null);
  readonly selectedPlantId = signal<number | null>(null);
  readonly selectedContactId = signal<number | null>(null);

  readonly selectedCompany = computed(() => {
    const id = this.selectedCompanyId();
    return id ? this.companies.byId(id)() : null;
  });

  readonly selectedPlant = computed(() => {
    const id = this.selectedPlantId();
    return id ? this.plants.byId(id)() : null;
  });

  readonly selectedContact = computed(() => {
    const id = this.selectedContactId();
    return id ? this.contacts.byId(id)() : null;
  });

  readonly detailKind = signal<DetailKind>(null);

  // Simple breadcrumbs
  readonly breadcrumb = computed<string[]>(() => {
    const trail: string[] = [];
    const c = this.selectedCompany();
    const p = this.selectedPlant();
    const ct = this.selectedContact();
    if (c) trail.push(c.name);
    if (p) trail.push(p.name);
    if (ct) trail.push(ct.name);
    return trail;
  });

  readonly companiesList = this.companies.all;
  readonly plantsList = computed(() => {
    const companyId = this.selectedCompanyId();
    return companyId ? this.plants.byCompanyId(companyId)() : this.plants.all();
  });

  readonly contactsList = computed(() => {
    const companyId = this.selectedCompanyId();
    const plantId = this.selectedPlantId();
    return this.contacts.filtered({
      companyId: companyId ?? undefined,
      plantId: plantId ?? undefined,
    })();
  });

  openCompany(id: number) {
    this.selectedCompanyId.set(id);
    this.selectedPlantId.set(null);
    this.selectedContactId.set(null);
    this.detailKind.set('company');
  }

  openPlant(id: number) {
    this.selectedPlantId.set(id);
    const p = this.selectedPlant();
    if (p?.company?.id) this.selectedCompanyId.set(p.company.id);
    this.selectedContactId.set(null);
    this.detailKind.set('plant');
  }

  openContact(id: number) {
    this.selectedContactId.set(id);
    const ct = this.selectedContact();
    if (ct?.company?.id) this.selectedCompanyId.set(ct.company.id);
    if (ct?.plantCompany?.id) this.selectedPlantId.set(ct.plantCompany.id);
    this.detailKind.set('contact');
  }

  backToList() {
    this.selectedCompanyId.set(null);
    this.selectedPlantId.set(null);
    this.selectedContactId.set(null);
    this.detailKind.set(null);
  }

  readonly search = signal<string>('');
  readonly sortBy = signal<'name' | 'industry' | 'city' | 'company'>('name');
  readonly sortDir = signal<'asc' | 'desc'>('asc');

  private sortList<T>(list: T[], key: keyof T): T[] {
    const dir = this.sortDir();
    return [...list].sort((a: any, b: any) => {
      const va = a?.[key] ?? '';
      const vb = b?.[key] ?? '';
      return (va > vb ? 1 : va < vb ? -1 : 0) * (dir === 'asc' ? 1 : -1);
    });
  }

  readonly companiesView = computed(() => {
    const q = this.search().toLowerCase().trim();
    const src = this.companiesList();
    const filtered = q ? src.filter((c) => c.name.toLowerCase().includes(q)) : src;
    return this.sortBy() === 'name' ? this.sortList(filtered, 'name') : filtered;
  });

  readonly plantsView = computed(() => {
    const q = this.search().toLowerCase().trim();
    const src = this.plantsList();
    const filtered = q ? src.filter((p) => p.name.toLowerCase().includes(q)) : src;
    return this.sortBy() === 'name' ? this.sortList(filtered, 'name') : filtered;
  });

  readonly contactsView = computed(() => {
    const q = this.search().toLowerCase().trim();
    const src = this.contactsList();
    const filtered = q ? src.filter((ct) => ct.name.toLowerCase().includes(q)) : src;
    return this.sortBy() === 'name' ? this.sortList(filtered, 'name') : filtered;
  });
}
