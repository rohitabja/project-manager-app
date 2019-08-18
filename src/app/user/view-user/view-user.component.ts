import { Component, OnInit , Input} from '@angular/core';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  @Input() users: User[];
  searchText: string;

  constructor(private userService: UserService) { }

  ngOnInit() { }

  deleteUser(user: User) {
    this.userService.deleteUser(user.userId);
  }

}
