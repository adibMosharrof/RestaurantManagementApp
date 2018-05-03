import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../shared/data-storage.service';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../../../shared/order.model';
import {IngredientServiceService} from '../../food-item/add-new-food-item/add-ingredients/ingredient-service.service';

@Component({
  selector: 'app-order-grid-view',
  templateUrl: './order-grid-view.component.html',
  styleUrls: ['./order-grid-view.component.scss']
})
export class OrderGridViewComponent implements OnInit {

  orderLists: Order[] = [];
  grossSale = 0;
  grossCost = 0;
  grossProfit = 0;
  totalOrder = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private _ingredientService: IngredientServiceService) { }

  ngOnInit() {
    this._dataStorageService.getOrders()
      .subscribe(
        (order: Order[]) => {
          this._ourOfferService.ordersList = order;
        }
      );
    this.orderLists = this._ourOfferService.ordersList;
    this._ourOfferService.ordersListChanged
      .subscribe(
        (order: Order[]) => {
          this.orderLists = order;
        }
      );

    for (let i = 0; i < this.orderLists.length; i++ ) {

      this.grossSale = this.grossSale
        + Number.parseInt(this.orderLists[i].TotalPrice.toString());

      this.grossCost = this.grossCost
        + Number.parseInt(this.orderLists[i].InventoryCost.toString());

      this.grossProfit = this.grossProfit
        + Number.parseInt(this.orderLists[i].Profit.toString());
    }

    this.totalOrder = this.orderLists.length;

  }
  viewDetails(orderList: Order) {
    const orderId =  orderList.Id;
    this.router.navigate(['admin/orders/grid-details', orderId]);
  }

}