import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Table} from '../../../../models/table.model';
import {MatTableDataSource} from '@angular/material';
import {Role} from '../../../../models/role.model';
import {NgForm} from '@angular/forms';
import {UserAccount} from '../../../../models/user-account.model';
import {UserAccountDataStorageService} from '../../../../services/data-storage/user-account-data-storage.service';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements OnInit {
  isDisabled = false;
  roles: Role[] = [];


  constructor(private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrManager,
              private userAccountDataStorageService: UserAccountDataStorageService) {
  }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Role[]) => {
          this.roles = data['roles'];
        }
      );
  }

  register(form: NgForm) {
    if (form.value.password !== form.value.confirmPassword) {
      this.toastr.errorToastr('Passwords do not match', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return;
    }

    this.isDisabled = true;
    const userAccount = new UserAccount(
      form.value.userName,
      form.value.firstName,
      form.value.lastName,
      form.value.email,
      form.value.password,
      form.value.phoneNumber,
      '',
      ['', form.value.role]
    );
    this.userAccountDataStorageService.register(userAccount)
      .subscribe(
        (result: any) => {
          if (result.Succeeded) {
            this.toastr.successToastr('New user added', 'Success', {
              toastTimeout: 10000,
              newestOnTop: true,
              showCloseButton: true
            });
            form.reset();
          } else {
            this.toastr.errorToastr(result.Errors[0], 'Error', {
              toastTimeout: 10000,
              newestOnTop: true,
              showCloseButton: true
            });
            this.isDisabled = false;

          }
        }
      );


  }
}