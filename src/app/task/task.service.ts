import { Injectable } from '@angular/core';
import { HttpclientHelperService } from 'src/app/httpclient-helper.service';
import { Observable } from 'rxjs/internal/Observable';
import { Task } from 'src/app/model/Task';
import { ParentTask } from 'src/app/model/ParentTask';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskUrl = 'task';

  constructor(private httpClientHelper: HttpclientHelperService) { }

  submitTask(task: Task): Observable<Task> {
    var taskRequest = {
      ...task, 
      startDate: task.startDate ? task.startDate.format('DD-MM-YYYY') : null,
      endDate: task.endDate ? task.endDate.format('DD-MM-YYYY') : null
    };
    return this.httpClientHelper.postCall(this.taskUrl, taskRequest);
  }

  endTask(task: Task): Observable<Task> {
    return this.httpClientHelper.postCall(this.taskUrl, task);
  }

  getTask(taskId: number): Observable<Task> {
    const url = `${this.taskUrl}/${taskId}`;
    return this.httpClientHelper.getCall(url, `getTask taskId=${taskId}`);
  }

  getTasksByProjectId(projectId: number): Observable<Task[]> {
    const url = `${this.taskUrl}/project/${projectId}`;
    return this.httpClientHelper.getCall(url, `getTasksByProjectId projectId=${projectId}`);
  }

  getParentTasks(): Observable<ParentTask[]> {
    const url = `${this.taskUrl}/parent`;
    return this.httpClientHelper.getCall(url, `getParentTasks`);
  }

}
