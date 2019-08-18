import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/model/Project';
import { Task } from 'src/app/model/Task';
import { User } from 'src/app/model/User';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl, NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UserService } from 'src/app/user/user.service';
import { ProjectService } from 'src/app/project/project.service';
import { ParentTask } from 'src/app/model/ParentTask';
import { TaskService } from 'src/app/task/task.service';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  taskForm: FormGroup;
  navigationSubscription;
  projects: Project[];
  filteredProjects: Observable<Project[]>;
  parentTasks: ParentTask[];
  filteredParentTasks: Observable<ParentTask[]>;
  users: User[];
  filteredUsers: Observable<User[]>;
  startDateInput: Moment;
  endDateInput: Moment;

  errorMessage: string;

  constructor(private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder) {

      route.params.subscribe(val => {
        this.errorMessage = null;
        this.loadTask();
      });
  }

  ngOnInit() {
    this.initialize();
    this.taskForm = this.formBuilder.group({
      taskId: [null],
      project: [null, Validators.required],
      taskName: [null, Validators.required],
      parent: [false],
      parentTask: [{ value: null, disabled: false }],
      priority: [{ value: null, disabled: false }],
      startDate: [{ value: null, disabled: false }],
      endDate: [{ value: null, disabled: false }],
      user: [null, Validators.required]
    });

    this.filteredProjects = this.taskForm.get('project').valueChanges
      .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : null),
      map(value => this._filterProject(value))
      );

    this.filteredParentTasks = this.taskForm.get('parentTask').valueChanges
      .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : null),
      map(value => this._filterParentTask(value))
      )

    this.filteredUsers = this.taskForm.get('user').valueChanges
      .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : null),
      map(value => this._filterUsers(value))
      )

    this.taskForm.get('parent').valueChanges.subscribe(value => {
      if (value) {
        this.taskForm.get('parentTask').disable();
        this.taskForm.get('priority').disable();
        this.taskForm.get('startDate').disable();
        this.taskForm.get('endDate').disable();
      } else {
        this.taskForm.get('parentTask').enable();
        this.taskForm.get('priority').enable();
        this.taskForm.get('startDate').enable();
        this.taskForm.get('endDate').enable();
      }
    });
  }

  shouldDisableFields(): boolean {
    return this.taskForm.get('parent').value;
  }

  initialize() {
    this.projectService.getProjects().subscribe(projects => this.projects = projects);
    this.taskService.getParentTasks().subscribe(parentTasks => this.parentTasks = parentTasks);
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  private _filterProject(name: string): Project[] {
    if(!name) {
      return [];
    }
    const filterValue = name.toLowerCase();

    return this.projects ? this.projects.filter(project => project.projectName.toLowerCase().includes(filterValue))
      : [];
  }

  private _filterParentTask(name: string): ParentTask[] {
    if(!name) {
      return [];
    }
    const filterValue = name.toLowerCase();

    return this.parentTasks ? this.parentTasks.filter(parentTask => parentTask.parentTaskName.toLowerCase().includes(filterValue))
      : [];
  }

  private _filterUsers(name: string): User[] {
    if(!name) {
      return [];
    }
    const filterValue = name.toLowerCase();

    return this.users ? this.users.filter(user => this.filterUser(filterValue, user))
      : [];
  }

  private filterUser(filterValue: string, user: User): boolean {
    return user.employeeId.toString().includes(filterValue)
      || user.firstName.toLowerCase().includes(filterValue)
      || user.lastName.toLowerCase().includes(filterValue);
  }

  displayProjectFn(project: Project): string | undefined {
    return project ? project.projectName : undefined;
  }

  displayParentFn(parentTask: ParentTask): string {
    return parentTask ? parentTask.parentTaskName : null;
  }

  displayUserFn(user?: User): string | undefined {
    return user ? user.firstName + '  ' + user.lastName + ' (' + user.employeeId + ')' : undefined;
  }

  onSubmit(): void {
    console.log(this.taskForm.value);
    var submittedTask = {
      taskId: this.taskForm.get('taskId').value,
      taskName: this.taskForm.get('taskName').value,
      startDate: this.taskForm.get('startDate').value,
      endDate: this.taskForm.get('endDate').value,
      priority: this.taskForm.get('priority').value,
      parentTask: this.taskForm.get('parentTask').value,
      user: this.taskForm.get('user').value,
      project: this.taskForm.get('project').value,
      parent: this.taskForm.get('parent').value
    };

    this.taskService.submitTask(submittedTask).subscribe(
      resp => {
        this.taskForm.reset();
      },
      err => {
        this.errorMessage = 'Error occurred while saving task, reason: ' + err.error.message;
      });
  }

  shouldDisableSubmit() {
    return typeof this.taskForm.get('project').value === 'string'
      || typeof this.taskForm.get('user').value === 'string';
  }

  loadTask() {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    if(taskId) {
      this.taskService.getTask(+taskId).subscribe(task => {
        this.taskForm.setValue({
          taskId: task.taskId,
          project: task.project,
          taskName: task.taskName,
          parent: task.parent,
          parentTask: task.parentTask,
          priority: task.priority,
          startDate: task.startDate ? moment(task.startDate, 'DD-MM-YYYY') : null,
          endDate: task.endDate ? moment(task.endDate, 'DD-MM-YYYY') : null,
          user: task.user
        });

        this.taskForm.get('parent').disable();
        this.taskForm.get('user').disable();
        this.taskForm.get('project').disable();
      });
    }
  }

}
