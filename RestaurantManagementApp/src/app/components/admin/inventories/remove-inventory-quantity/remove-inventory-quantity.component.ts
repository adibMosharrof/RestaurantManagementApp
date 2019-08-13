import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';

@Component({
  selector: 'app-remove-inventory-quantity',
  templateUrl: './remove-inventory-quantity.component.html',
  styleUrls: ['./remove-inventory-quantity.component.scss']
})
export class RemoveInventoryQuantityComponent implements OnInit {
  isDisabled = false;
  inventory: Inventory;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              private toastr: ToastrManager,
              private inventoryDataStorageService: InventoryDataStorageService ) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      (data: Data) => {
        this.inventory = data['inventory'];

        if (this.inventory === undefined || this.inventory === null) {
          this.toastr.errorToastr('Item not found', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.router.navigate(['admin/inventories']);
        }
      }
    );
  }

  removeInventoryQuantity(form: NgForm) {
    const removalQuantity = form.value.quantity;
    if (!this.adminService.checkPricingConditions(removalQuantity)) {
      return;
    }
    this.isDisabled = true;

    this.inventoryDataStorageService.removeInventoryQuantity(
      new Inventory(
        this.inventory.Id,
        null,
        null,
        removalQuantity,
        null,
        null,
        []
      )
    ).subscribe(
      (data: any) => {
        if (data === 'Success') {
          this.toastr.successToastr('Quantity is removed', 'Success', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          form.reset();
          this.router.navigate(['admin/inventories/', this.inventory.Id]);
        } else {
          this.isDisabled = false;
          this.toastr.errorToastr('Too big quantity', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
        }
      });
  }
}
