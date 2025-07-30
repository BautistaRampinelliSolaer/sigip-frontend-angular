import { ObjectMiniDTO } from "../objects/object-mini-dto";

export interface PlantCompany {
  id: number;
  name: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  company: ObjectMiniDTO;
  clientContacts: ObjectMiniDTO[];
}
