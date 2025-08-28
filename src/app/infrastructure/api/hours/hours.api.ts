import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_URL } from "@app/core/http/api.tokens";
import { ApiResponse } from "@app/domain/models";
import { CreateProjectHoursRequest } from "@app/domain/models/hours/create-project-hours-request";
import { ProjectHoursDTO } from "@app/domain/models/hours/project-hours-dto";

@Injectable({
  providedIn: 'root'
})
export class HoursApi {
    private readonly http = inject(HttpClient);
    private readonly api = inject(API_URL) + '/api/hours';

    getProjectHoursByUserId(userId: number) {
        return this.http.get<ApiResponse<ProjectHoursDTO[]>>(`${this.api}/project-hours/ByUser/${userId}`);
    }

    createProjectHours(payload: CreateProjectHoursRequest) {
        return this.http.post<ApiResponse<ProjectHoursDTO>>(`${this.api}/project-hours/create`, payload);
    }

}