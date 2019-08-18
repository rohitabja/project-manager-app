import { Injectable } from '@angular/core';
import { User } from 'src/app/model/User';
import { Observable, of, throwError } from 'rxjs';
import { HttpclientHelperService } from 'src/app/httpclient-helper.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'user';

  constructor(private httpClientHelper: HttpclientHelperService) { }

  submitUser(user: User): Observable<User> {
    return this.httpClientHelper.postCall(this.userUrl, user);
  }

  getUser(userId: number): Observable<User> {
    const url = `${this.userUrl}/${userId}`;
    return this.httpClientHelper.getCall(url, `getUser userId=${userId}`);
  }

  getUsers(): Observable<User[]> {
    return this.httpClientHelper.getCall('user', 'getUsers');
  }

  deleteUser(userId: number): void {
    const deleteUrl = `${this.userUrl}/${userId}`;
    this.httpClientHelper.deleteCall(deleteUrl);
  }

}
