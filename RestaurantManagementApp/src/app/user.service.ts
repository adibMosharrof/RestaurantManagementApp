import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { RoleModel } from './shared/role.model';

import {ModifiedUserModel} from './shared/modified-user.model';

@Injectable()
export class UserService {

  readonly rootUrl = 'http://localhost:4202';
  private _modifiedUserJson = 'assets/modified-user.json';
  private _modifiedUserApi = 'http://localhost:4202/api/GetUsersList';

  public modifiedUser: ModifiedUserModel[] = [];
  public modifiedUserChanged =  new Subject<ModifiedUserModel[]>();

  constructor(private _http: Http) { }

  registerUser(name: string, password: string, email: string, role: string, dateTime: string) {
    const body = {
      UserName: name,
      Password: password,
      Email: email,
      Role : role,
      DateTime : dateTime
    };
    const reqHeader = new HttpHeaders({'No-Auth': 'True'});
    return this._http.post('http://localhost:4202' + '/api/User/Register', body
      );
  }

  userAuthentication(userName, password) {
    const data = 'username=' + userName + '&password=' + password + '&grant_type=password';
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this._http.post(this.rootUrl + '/token', data);
  }


  getAllRoles() {
    return this._http.get('/assets/role.json').map(
      (response: any) => {
        const role: RoleModel[] = response.json();
        console.log(role);
        return role;
      }
    );
  }

  resetPassword(userName: string) {
    const body = {
      UserName: userName,
      Id: '',
      NewPassword: ''
    };
    return this._http.post(this.rootUrl + '/api/ResetPassword', body);
  }

  newPassword(password: string, code: string) {
    const body = {
      UserName: '',
      Id: code,
      NewPassword: password
    };
    return this._http.post(this.rootUrl + '/api/NewPassword', body);
  }

  roleMatch(allowedRoles) {
    let isMatch = false;
    const userRoles: string
      = JSON.parse(JSON.stringify(localStorage.getItem('userRoles')));
    allowedRoles.forEach(element => {
      if (userRoles.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }

  deleteUser(user: ModifiedUserModel, index: number) {
    this.modifiedUser.splice(index, 1);
    this.modifiedUserChanged.next(this.modifiedUser.slice());
    return this._http.post(this.rootUrl + '/api/DeleteUser', user).subscribe();
  }

  getUsers() {
    return this._http.get(this._modifiedUserApi).map(
      (response: any) => {
        const users: ModifiedUserModel[] = response.json();
        console.log(users);
        return users;
      }
    );
  }

  addToUserList(user: ModifiedUserModel) {
    this.modifiedUser.push(user);
    this.modifiedUserChanged.next(this.modifiedUser.slice());
  }

}
