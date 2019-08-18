import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/model/Project';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { UserService } from 'src/app/user/user.service';
import { User } from 'src/app/model/User';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ProjectService } from 'src/app/project/project.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit, OnDestroy {

  project: Project = {
    projectId: null,
    projectName: null,
    dateChecked: false,
    startDate: null,
    endDate: null,
    priority: null,
    manager: null,
    tasks: null
  };

  users: User[];
  filteredUsers: Observable<User[]>;
  managerFormControl = new FormControl({value: this.project.manager, disabled: this.project.projectId});
  navigationSubscription;
  errorMessage;
  projects: Project[];

  constructor(private userService: UserService, 
              private projectService: ProjectService, 
              private router: Router, 
              public route: ActivatedRoute) { 
                
    route.params.subscribe(val => {
      this.errorMessage = null;
      this.loadProject();
    });

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialize();
      }
    });
  }

  loadProject() {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if(projectId) {
      this.projectService.getProject(+projectId).subscribe(project => {
        this.project = {...project, 
          dateChecked: project.startDate !== null,
          startDate: project.startDate ? moment(project.startDate, 'DD-MM-YYYY') : null,
          endDate: project.endDate ? moment(project.endDate, 'DD-MM-YYYY') : null
        };
        this.managerFormControl.setValue(this.project.manager);
        this.managerFormControl.disable();
      });
    }
  }

  initialize() {
    // Set default values and re-fetch any data you need.
    this.userService.getUsers().subscribe(users => this.users = users);
    this.projectService.getProjects().subscribe(projects => this.projects = projects);
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.filteredUsers = this.managerFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : ''),
        map(value => this._filter(value))
      );
  }

  displayFn(user?: User): string | undefined {
    return user ? user.firstName + '  ' + user.lastName + ' (' + user.employeeId + ')' : undefined;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.users ? this.users.filter(user => this.filterUser(filterValue, user))
                      : [];
  }

  private filterUser(filterValue: string, user: User): boolean {
    return user.employeeId.toString().includes(filterValue) 
           || user.firstName.toLowerCase().includes(filterValue)
           || user.lastName.toLowerCase().includes(filterValue);
  }

  onSubmit(projectForm: NgForm) {

    var submittedProject = {
      projectId: this.project.projectId,
      projectName: this.project.projectName,
      dateChecked: this.project.dateChecked,
      startDate: this.project.startDate,
      endDate: this.project.endDate,
      priority: this.project.priority,
      manager: this.managerFormControl.value
    };

    this.projectService.submitProject(submittedProject).subscribe(
      resp => {
        this.router.navigateByUrl("/addProject");
        this.managerFormControl.reset();
        projectForm.resetForm();
      },
      err => {
        this.errorMessage = 'Error occurred while saving project, reason: ' + err.error.message;
      });
  }

  shouldDisable(): boolean {
    return typeof this.managerFormControl.value === 'string' 
           || !this.managerFormControl.value
           || !this.managerFormControl.value.userId;
  }

  onDateCheckedChangeEvent() {
    if(!this.project.dateChecked) {
      this.project.startDate = null;
      this.project.endDate = null;
    }
  }

}
