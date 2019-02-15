import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  public userName: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.userName = JSON.parse(JSON.stringify(localStorage.getItem('userName')));
  }

  logOut() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }


}
