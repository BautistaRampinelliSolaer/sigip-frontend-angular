import { ObjectMiniDTO } from "../objects/object-mini-dto";

export interface DocumentHours {
  id: number;
  document: DocumentMiniDTO;
  user: ObjectMiniDTO;
  workedHours: number; // In java is Double, review this.
  workDate: Date;
  description: string;
}
