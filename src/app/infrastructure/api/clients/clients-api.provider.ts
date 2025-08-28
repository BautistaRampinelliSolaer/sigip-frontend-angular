import { CLIENT_CONTACT_API_PROVIDER } from "./client-contact/client-contact.provider";
import { COMPANY_API_PROVIDER } from "./company/company.provider";
import { PLANT_COMPANY_API_PROVIDER } from "./plant-company/plant-company.provider";

export function clientsApiProvider() {
    return [COMPANY_API_PROVIDER, PLANT_COMPANY_API_PROVIDER, CLIENT_CONTACT_API_PROVIDER];
}