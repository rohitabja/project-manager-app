import { Injectable } from '@angular/core';
import { HttpclientHelperService } from 'src/app/httpclient-helper.service';
import { Project } from 'src/app/model/Project';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectUrl = 'project';

  constructor(private httpClientHelper: HttpclientHelperService) { }

  submitProject(project: Project): Observable<Project> {
    var projectRequest = {
      ...project, 
      startDate: project.startDate ? project.startDate.format('DD-MM-YYYY') : null,
      endDate: project.endDate ? project.endDate.format('DD-MM-YYYY') : null
    };
    return this.httpClientHelper.postCall(this.projectUrl, projectRequest);
  }

  getProject(projectId: number): Observable<Project> {
    const url = `${this.projectUrl}/${projectId}`;
    return this.httpClientHelper.getCall(url, `getProject projectId=${projectId}`);
  }

  getProjects(): Observable<Project[]> {
    return this.httpClientHelper.getCall(this.projectUrl, 'getProjects');
  }

  suspendProject(projectId: number): void {
  }
}
