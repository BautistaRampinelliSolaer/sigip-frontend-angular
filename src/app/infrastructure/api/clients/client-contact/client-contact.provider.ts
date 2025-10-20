import { inject } from "@angular/core";
import { ClientContactApi } from "./client-contact.api";
import { ClientContactHttpApi } from "./client-contact.http.api";
import { ClientContactMockApi } from "./client-contact.api.mock";
import { USE_MOCK_CLIENT_CONTACT_API } from "./client-contact.token";

export const CLIENT_CONTACT_API_PROVIDER = {
    provide: ClientContactApi,
    useFactory: () => inject(USE_MOCK_CLIENT_CONTACT_API) ? inject(ClientContactMockApi) : inject(ClientContactHttpApi),
};