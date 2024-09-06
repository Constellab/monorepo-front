import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlApiService } from '@monorepo/front-core-lib';
import { CaLabProject } from '../model/entities/lab/ca-lab-project.class';

@Injectable({
  providedIn: 'root'
})
export class CaLabProjectService {

  private readonly route: string = 'lab-project';

  constructor(private apiService: FlApiService) {
  }

  public addProjectToLab(labId: string, projectId: string): Observable<CaLabProject> {
    return this.apiService.post(`${this.route}/${labId}/project/${projectId}`, null,
      CaLabProject);
  }

  public removeProjectFromLab(labId: string, projectId: string): Observable<CaLabProject> {
    return this.apiService.delete(`${this.route}/${labId}/project/${projectId}`, CaLabProject);
  }

  public getLabInstanceProjects(labId: string): Observable<CaLabProject[]> {
    return this.apiService.get(`${this.route}/${labId}/project`, CaLabProject);
  }

  public syncLabProject(labId: string, projectId: string): Observable<void> {
    return this.apiService.put(`${this.route}/${labId}/project/${projectId}/sync`, null);
  }
}
