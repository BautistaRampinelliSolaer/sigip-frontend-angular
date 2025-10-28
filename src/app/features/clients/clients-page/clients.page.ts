import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbsComponent } from '@app/shared/ui';
import { ClientsToolbar } from '../ui/molecules/toolbar/toolbar';
import { CompaniesTable } from '../ui/organisms/companies-table/table';
import { PlantsTableComponent } from '../ui/organisms/plants-table/plants-table';
import { ClientContactTable } from '../ui/organisms/client-contact-table/client-contact-table';
import { MatIconModule } from "@angular/material/icon";
import { ClientsUiState } from '../state/clients-ui.state';

@Component({
  selector: 'clients-page',
  imports: [
    MatButtonToggleModule,
    MatCardModule,
    BreadcrumbsComponent,
    ClientsToolbar,
    CompaniesTable,
    PlantsTableComponent,
    ClientContactTable,
    MatIconModule
],
  templateUrl: './clients-page.html',
  styleUrls: ['./clients-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPage {
  private readonly ui = inject(ClientsUiState);

  // bind UI store signals
  protected readonly activeTab = this.ui.activeTab;
  protected readonly breadcrumb = this.ui.breadcrumb;

  protected readonly search = this.ui.search;
  protected readonly sortBy = this.ui.sortBy;
  protected readonly sortDir = this.ui.sortDir;

  // views
  protected readonly companies = this.ui.companiesView;
  protected readonly plants = this.ui.plantsView;
  protected readonly contacts = this.ui.contactsView;

  // detail selection (drawer)
  protected readonly detailKind = this.ui.detailKind;
  protected readonly selectedCompany = this.ui.selectedCompany;
  protected readonly selectedPlant = this.ui.selectedPlant;
  protected readonly selectedContact = this.ui.selectedContact;

  // helpers
  protected readonly hasDetail = computed(() => !!this.detailKind());

  // actions
  protected openCompany = (id: number) => this.ui.openCompany(id);
  protected openPlant = (id: number) => this.ui.openPlant(id);
  protected openContact = (id: number) => this.ui.openContact(id);
  protected backToList = () => this.ui.backToList();

  protected onTab(tab: 'companies' | 'plants' | 'contacts') {
    this.activeTab.set(tab);
  }
}
