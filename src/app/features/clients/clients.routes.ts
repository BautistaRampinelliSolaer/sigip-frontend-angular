import { Routes } from "@angular/router";
import { USE_MOCK_CLIENT_CONTACT_API } from "@app/infrastructure/api/clients/client-contact/client-contact.token";
import { clientsApiProvider } from "@app/infrastructure/api/clients/clients-api.provider";
import { USE_MOCK_COMPANY_API } from "@app/infrastructure/api/clients/company/company.token";
import { USE_MOCK_PLANT_COMPANY_API } from "@app/infrastructure/api/clients/plant-company/plant-company.token";
import { provideClientsInit } from "./clients.init";

export default [
    {
        path: '',
        providers: [
            clientsApiProvider(),
            { provide: USE_MOCK_COMPANY_API, useValue: true },
            { provide: USE_MOCK_PLANT_COMPANY_API, useValue: true },
            { provide: USE_MOCK_CLIENT_CONTACT_API, useValue: true },
            provideClientsInit(),
        ],
        loadComponent: () => import('./clients-page/clients.page').then(m => m.ClientsPage),
    }
] satisfies Routes;