import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task/task.service';
import { Task } from 'src/app/model/Task';
import { Project } from 'src/app/model/Project';
import { ProjectService } from 'src/app/project/project.service';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  projects: Project[];
  filteredProjects: Observable<Project[]>;
  projectFormControl = new FormControl('');
  tasks: Task[];

  constructor(private taskService: TaskService, private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.getProjects().subscribe(projects => this.projects = projects);
    this.filteredProjects = this.projectFormControl.valueChanges
      .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(value => this._filterProject(value))
      );
  }

  displayProjectFn(project: Project): string | undefined {
    return project ? project.projectName : undefined;
  }

  private _filterProject(name: string): Project[] {
    const filterValue = name.toLowerCase();

    return this.projects ? this.projects.filter(project => project.projectName.toLowerCase().includes(filterValue))
      : [];
  }

  endTask(task: Task): void {
    var submittedTask = {...task,
      completed: true
    };

    this.taskService.endTask(submittedTask).subscribe(
      resp => {
        console.log("Task completed successfully");
        this.taskService.getTasksByProjectId(this.projectFormControl.value.projectId).subscribe(
          tasks => this.tasks = tasks);
      },
      err => {
        console.error('Error occurred while saving task, reason: ' + err.error);
      });
  }

  search() {
    if(typeof this.projectFormControl.value !== 'string') {
      if(this.projectFormControl.value && this.projectFormControl.value.projectId) {
        this.taskService.getTasksByProjectId(this.projectFormControl.value.projectId).subscribe(
          tasks => this.tasks = tasks);
      }
    }
  }

}
