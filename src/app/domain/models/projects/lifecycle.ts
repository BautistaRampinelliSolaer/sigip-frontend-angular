import { ObjectMiniDTO } from "../common/object-mini-dto";

export interface lifecycleDTO {
    id: number;
    objAssigned: ObjectMiniDTO;
    previousState: string;
    newState: string;
    description: string;
    type: string;
}

export interface createLifecycleRequest {
    objAssignedId: number;
    assignedType: string;
    userId: number;
    previousState: string;
    newState: string;
    description: string;
    type: string;
}