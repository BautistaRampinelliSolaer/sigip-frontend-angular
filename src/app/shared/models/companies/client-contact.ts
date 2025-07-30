import { ObjectMiniDTO } from "../objects/object-mini-dto";

export interface ClientContact {
    id: number;
    name: string;
    email: string;
    phone: string;
    cellphone: string;
    number_intern: string;
    country: string;
    city: string;
    company: ObjectMiniDTO[];
    plantCompany: ObjectMiniDTO[];
}
