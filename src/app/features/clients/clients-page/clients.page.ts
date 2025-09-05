import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { ClientsUiStore } from '../state/clients-ui.store';

// Nuestro organism reusado
import { DataGrid } from '@shared/ui/organisms/data-grid/data-grid';
import { ColumnDef } from '@shared/ui/models/data-grid';

type ViewMode = 'all' | 'companies' | 'plants' | 'contacts';

@Component({
  selector: 'clients-page',
  imports: [MatButtonToggleModule, MatCardModule, DataGrid],
  templateUrl: './clients-page.html',
  styleUrls: ['./clients-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPage {
  private readonly ui = inject(ClientsUiStore);

  // modo de visualización: 3 tablas o maximizar una
  readonly viewMode = signal<ViewMode>('all');

  // Datos provenientes del store (ya filtrados/ordenados por tus signals)
  readonly companies = this.ui.companiesView;
  readonly plants = this.ui.plantsView;
  readonly contacts = this.ui.contactsView;

  // Columnas para cada entidad (muestran nested.name cuando corresponde)
  readonly companyCols: ColumnDef<any>[] = [
    { id: 'name', header: 'Empresa', accessor: (r) => r.name, sortable: true, widthPx: 220 },
    { id: 'industry', header: 'Industria', accessor: (r) => r.industry, sortable: true },
    { id: 'group', header: 'Grupo', accessor: (r) => r.group, sortable: true },
  ];

  readonly plantCols: ColumnDef<any>[] = [
    { id: 'name', header: 'Planta', accessor: (r) => r.name, sortable: true, widthPx: 220 },
    { id: 'company', header: 'Empresa', accessor: (r) => r.company?.name, sortable: true },
    { id: 'country', header: 'País', accessor: (r) => r.country, sortable: true },
    { id: 'city', header: 'Ciudad', accessor: (r) => r.city, sortable: true },
  ];

  readonly contactCols: ColumnDef<any>[] = [
    { id: 'name', header: 'Contacto', accessor: (r) => r.name, sortable: true, widthPx: 220 },
    { id: 'email', header: 'Email', accessor: (r) => r.email, sortable: true },
    { id: 'phone', header: 'Teléfono', accessor: (r) => r.phone, sortable: true },
    { id: 'company', header: 'Empresa', accessor: (r) => r.company?.name, sortable: true },
    { id: 'plant', header: 'Planta', accessor: (r) => r.plantCompany?.name, sortable: true },
    { id: 'city', header: 'Ciudad', accessor: (r) => r.city, sortable: true },
  ];

  // helpers para layout
  readonly showCompanies = computed(
    () => this.viewMode() === 'all' || this.viewMode() === 'companies',
  );
  readonly showPlants = computed(() => this.viewMode() === 'all' || this.viewMode() === 'plants');
  readonly showContacts = computed(
    () => this.viewMode() === 'all' || this.viewMode() === 'contacts',
  );

  // Navegación/selección sincronizada con tu store
  openCompany = (row: any) => this.ui.openCompany(row.id);
  openPlant = (row: any) => this.ui.openPlant(row.id);
  openContact = (row: any) => this.ui.openContact(row.id);
}
