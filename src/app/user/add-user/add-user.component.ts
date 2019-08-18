import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { User } from 'src/app/model/User';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, OnDestroy {

  user: User = {
    userId: null,
    firstName: null,
    lastName: null,
    employeeId: null,
    deleted: false
  };

  users: User[];
  errorMessage: string;
  navigationSubscription;

  constructor(private userService: UserService, public route: ActivatedRoute, private router:Router) { 
    route.params.subscribe(val => {
      this.errorMessage = null;
      this.loadUser();
    });

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseUsers();
      }
    });
  }

  ngOnInit() {
    this.errorMessage = null;
  }

  initialiseUsers() {
    // Set default values and re-fetch any data you need.
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  onSubmit(userForm: NgForm) {
    this.userService.submitUser(this.user).subscribe(
      resp => {
        this.router.navigateByUrl("/addUser");
        userForm.reset();
      },
      err => {
        this.errorMessage = 'Error occurred while saving user, reason: ' + err.error.message;
      });
  }

  loadUser() {
    const userId = this.route.snapshot.paramMap.get('userId');
    if(userId) {
      this.userService.getUser(+userId).subscribe(user => {
        this.user = user
      });
    }
  }

}
