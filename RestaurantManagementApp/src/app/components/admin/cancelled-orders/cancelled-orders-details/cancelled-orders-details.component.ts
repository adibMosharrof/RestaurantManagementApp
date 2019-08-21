import {Component, OnInit} from '@angular/core';
import {Order} from '../../../../models/order.model';
import {Table} from '../../../../models/table.model';
import {FoodItem} from '../../../../models/food-item.model';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {ToastrManager} from 'ng6-toastr-notifications';
import {OrderDataStorageService} from '../../../../services/data-storage/order-data-storage.service';
import {OrderedItem} from '../../../../models/ordered-item.model';
import {OrderSession} from '../../../../models/order-session.model';
import {AdminService} from '../../../../services/shared/admin.service';

@Component({
  selector: 'app-cancelled-orders-details',
  templateUrl: './cancelled-orders-details.component.html',
  styleUrls: ['./cancelled-orders-details.component.scss']
})
export class CancelledOrdersDetailsComponent implements OnInit {
  orders: Order[] = [];
  cancelledOrderedItem: OrderedItem;

  tables: Table[] = [];
  foodItems: FoodItem[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public adminService: AdminService,
              private toastr: ToastrManager,
              private orderDataStorageService: OrderDataStorageService) { }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Data) => {
          const cancelledOrderedItemId = +this.route.snapshot.paramMap.get('id');
          this.orders = data['orders'];
          this.cancelledOrderedItem = this.getCancelledOrderedItem(cancelledOrderedItemId);
          if (this.cancelledOrderedItem === undefined) {
            this.toastr.errorToastr('Error', 'Resource not found');
            this.router.navigate(['admin/cancelled-orders']);
          }

          this.tables = data['tables'];
          this.foodItems = data['foodItems'];
        });
  }

  getCancelledOrderedItem(cancelledOrderedItemId: number) {
    const cancelledOrderedItems: OrderedItem[] = [];

    this.orders.forEach((order) => {
      order.OrderSessions.forEach((orderSession) => {
        orderSession.OrderedItems.forEach((orderedItem) => {
          if (orderedItem.CurrentState === 'Cancelled') {
            cancelledOrderedItems.push(orderedItem);
          }
        });
      });
    });

    return cancelledOrderedItems.find(x => x.Id === cancelledOrderedItemId);
  }


  getOrderedItemInformation(type: string) {
    let orderSession: OrderSession;
    for (let i = 0; i < this.orders.length; i++) {
      for (let j = 0; j < this.orders[i].OrderSessions.length; j++) {
        orderSession = this.orders[i].OrderSessions
          .find(x => x.Id === this.cancelledOrderedItem.OrderSessionId);
      }
      if (orderSession !== undefined) {
        break;
      }
    }

    if (orderSession === undefined) {
      return '';
    }

    const order = this.orders.find(x => x.Id === orderSession.OrderId);
    if (order === undefined) {
      return '';
    }

    if (type === 'dateTime') {
      return order.DateTime;
    } else if (type === 'tableName') {
      return this.adminService.getTableName(this.tables, order.TableId);
    } else {
      return order.SalesPersonName;
    }
  }


  getFoodItemInformation(type: string) {
    const foodItem = this.foodItems
      .find(x => x.Id === this.cancelledOrderedItem.FoodItemId);
    if (foodItem === undefined) {
      return 'Not found';
    }

    if (type === 'Name and Serial') {
      return foodItem.SerialNumber + '. ' + foodItem.Name;
    } else {
      return foodItem.Price;
    }

  }



}
