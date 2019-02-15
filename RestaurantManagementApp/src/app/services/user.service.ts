
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


import {ModifiedUserModel} from '../models/modified-user.model';
import {Subject} from 'rxjs';
import {Role} from '../models/role.model';
import {DataStorageService} from './data-storage.service';

@Injectable()
export class UserService {

  rootUrl = '';

  public modifiedUser: ModifiedUserModel[] = [];
  public modifiedUserChanged =  new Subject<ModifiedUserModel[]>();

  constructor(private http: HttpClient,
              private dataStorageService: DataStorageService) {
     this.rootUrl = this.dataStorageService.rootUrl;
  }

  registerUser(name: string, password: string,
               email: string, role: string, dateTime: string) {
    const body = {
      UserName: name,
      Password: password,
      Email: email,
      Role : role,
      DateTime : dateTime
    };
    const reqHeader = new HttpHeaders({'No-Auth': 'True'});
    return this.http.post(this.rootUrl + '/api/User/Register', body);
  }

  userAuthentication(userName, password) {
    const data = 'username=' + userName + '&password=' + password + '&grant_type=password';
    const reqHeader =
      new HttpHeaders(
        { 'Content-Type': 'application/x-www-urlencoded',
          'No-Auth': 'True' });
    return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader });
  }


  getAllRoles() {
    return this.http.get<Role[]>('/assets/mock-data/role.json');
  }

  resetPassword(userName: string) {
    const body = {
      UserName: userName,
      Id: '',
      NewPassword: ''
    };
    const reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.post(this.rootUrl + '/api/ResetPassword', body,
      { headers: reqHeader });
  }

  newPassword(password: string, code: string) {
    const body = {
      UserName: '',
      Id: code,
      NewPassword: password
    };

    const reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.post(this.rootUrl + '/api/NewPassword', body, { headers: reqHeader});
  }

  roleMatch(allowedRoles) {
    let isMatch = false;
    const userRole: string = JSON.parse(JSON.stringify(localStorage.getItem('userRoles')));
    allowedRoles.forEach(element => {
      if (userRole.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }

  deleteUser(user: ModifiedUserModel, index: number) {
    this.modifiedUser.splice(index, 1);
    this.modifiedUserChanged.next(this.modifiedUser.slice());
    return this.http.post(this.rootUrl + '/api/DeleteUser', user).subscribe();
  }

  getUsers() {
    return this.http.get<ModifiedUserModel[]>(this.rootUrl + '/api/GetUsersList');
  }

  addToUserList(user: ModifiedUserModel) {
    this.modifiedUser.push(user);
    this.modifiedUserChanged.next(this.modifiedUser.slice());
  }

}
