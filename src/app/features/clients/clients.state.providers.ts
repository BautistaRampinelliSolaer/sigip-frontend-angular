import { Provider } from "@angular/core";
import { ClientContactRepo } from "./state/repos/client-contact.repo";
import { CompanyRepo } from "./state/repos/company.repo";
import { PlantCompanyRepo } from "./state/repos/plant-company.repo";
import { ClientsUiStore } from "./state/clients-ui.store";
import { ClientsRouterSyncService } from "./state/clients-router-sync.service";

export function provideClientsState(): Provider[] {
    return [CompanyRepo, PlantCompanyRepo, ClientContactRepo, ClientsUiStore, ClientsRouterSyncService]
}