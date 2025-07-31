import { ObjectMiniDTO } from "../objects/object-mini-dto";
import { ProjectMiniDTO } from "../projects/project-mini-dto";

export interface Document {
  id: number;
  code: string;
  name: string;
  origin: string;
  type: string;
  careatedAt: Date;
  folderPath: string;
  milestone: string;
  status: string;
  executors: ObjectMiniDTO[];
  responsible: ObjectMiniDTO;
  reviewer: ObjectMiniDTO;
  project: ProjectMiniDTO;
}
