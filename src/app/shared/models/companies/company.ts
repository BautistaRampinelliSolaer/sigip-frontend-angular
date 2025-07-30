import { ObjectMiniDTO } from "../objects/object-mini-dto";

export interface Company {
  id: number;
  name: string;
  commercialName: string;
  logo: string;
  industry: string;
  group: string;
  plantsCompany: ObjectMiniDTO[];
  clientContacts: ObjectMiniDTO[];
}
