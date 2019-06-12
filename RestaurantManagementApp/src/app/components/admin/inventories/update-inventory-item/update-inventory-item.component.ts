import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Inventory} from '../../../../models/inventory.model';
import {InventoryHistory} from '../../../../models/inventory-history.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';

@Component({
  selector: 'app-update-inventory-item',
  templateUrl: './update-inventory-item.component.html',
  styleUrls: ['./update-inventory-item.component.scss']
})
export class UpdateInventoryItemComponent implements OnInit {
  isDisabled = false;

  inventoryId: number;
  inventory: Inventory;
  inventories: Inventory[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              private toastr: ToastrManager,
              private inventoryDataStorageService: InventoryDataStorageService ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.inventoryId = +params['inventory-id'];
        }
      );

  }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.inventories = data['inventories'];
        this.inventory = this.inventories.find( x => x.Id === this.inventoryId);

        if (this.inventory === undefined) {
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


  onUpdateInventoryItem(form: NgForm) {
    const buyingPrice = form.value.price;
    const buyingQuantity = form.value.quantity;

    if (!this.adminService.checkPricingConditions(buyingPrice) ||
      !this.adminService.checkPricingConditions(buyingQuantity) ) {
      return;
    }

    this.isDisabled = true;
    const inventoryId = this.inventoryId;
    const inventoryHistoryId = null;


    const buyingTime = new Date().toLocaleString();
    const updateHistory = new InventoryHistory(
        inventoryHistoryId,
        inventoryId,
        buyingQuantity,
        buyingTime,
        buyingPrice
    );

    this.inventoryDataStorageService.updateInventoryHistory(updateHistory).
    subscribe(
      (data: any) => {
        this.toastr.successToastr('Information is updated', 'Success', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        form.reset();
        this.router.navigate(['admin/inventories/', this.inventoryId]);
      }
    );
  }


}
