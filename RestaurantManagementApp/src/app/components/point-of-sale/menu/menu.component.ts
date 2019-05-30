import {Component, OnInit} from '@angular/core';
import {FoodItem} from '../../../models/food-item.model';
import {Inventory} from '../../../models/inventory.model';
import {Order} from '../../../models/order.model';
import {TableDataStorageService} from '../../../services/data-storage/table-data-storage.service';
import {PointOfSaleService} from '../../../services/shared/point-of-sale.service';
import {OrderedItem} from '../../../models/ordered-item.model';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {ToastrManager} from 'ng6-toastr-notifications';
import {Table} from '../../../models/table.model';
import {OrderSession} from '../../../models/order-session.model';
import {NgForm} from '@angular/forms';
import {Setting} from '../../../models/setting.model';
import {OrderDataStorageService} from '../../../services/data-storage/order-data-storage.service';

@Component({
  selector: 'app-food-items',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  tableId: number;
  table: Table;
  tables: Table[] = [];

  foodItems: FoodItem[] = [];
  inventories: Inventory[] = [];
  setting: Setting;

  order: Order;
  userName: string;

  imageUrl = 'assets/noImage.png';
  rootUrl = '';

  constructor(private pointOfSaleService: PointOfSaleService,
              private orderDataStorageService: OrderDataStorageService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private tableDataStorageService: TableDataStorageService) {
    this.route.params.subscribe((params: Params) => this.tableId = +params['table-id']);
  }


  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.foodItems = data['foodItems'];
      this.tables = data['tables'];
      this.inventories = data['inventories'];
      this.setting = data['setting'];
      this.userName = JSON.parse(JSON.stringify(localStorage.getItem('userNameForLogin')));
    });

    this.table = this.tables.find(x => x.Id === this.tableId);

    if (this.table === undefined) {
      this.toastr.errorToastr('This table is no longer available', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      this.router.navigate(['pos']);
    } else {
      this.order = this.table.Orders.find(x => x.CurrentState === 'Ordered'
        || x.CurrentState === 'Served');
      this.rootUrl = this.tableDataStorageService.rootUrl + '/Content/FoodItemImages/';
      this.setFoodItemImage();

    }
  }




  setFoodItemImage() {
    for (let i = 0; i < this.foodItems.length; i++) {
      if (this.foodItems[i].FoodItemImageName === null
        || this.foodItems[i].FoodItemImageName === '' ) {
        this.foodItems[i].FoodItemImageName = this.imageUrl;
      } else {
        this.foodItems[i].FoodItemImageName =
          this.rootUrl + this.foodItems[i].FoodItemImageName;
      }
    }
  }




  updateCart(foodItem: FoodItem, isAddToCart: boolean, form?: NgForm, directQuantity?: number ) {

    let quantity;

    if (directQuantity !== undefined) {
      quantity = directQuantity;
    } else {
      quantity = form.value.indirectQuantity;
    }

    this.pointOfSaleService.checkCartConditions(quantity);

    const foodItemId = foodItem.Id;
    const foodItemName = foodItem.Name;
    const price = foodItem.Price;
    const orderId = null;
    const subTotal = price * quantity;

    if (isAddToCart) {

      if (!this.pointOfSaleService.checkIfInventoryExists(quantity, foodItem, this.foodItems, this.inventories)) {
        return;
      }

      const orderedItem = new OrderedItem(
        null,
        null,
        null,
        foodItem.Id,
        quantity,
        subTotal
      );

      if (!this.pointOfSaleService.deductInventories(foodItem, this.inventories, quantity)) {
        return;
      }

      if (this.order === undefined) {

        const orderedItems: OrderedItem[] = [];
        orderedItems.push(orderedItem);

        const orderSession = new OrderSession(
          null,
          null,
          orderedItems,
          'Not Ordered'
        );

        const orderSessions: OrderSession[] = [];
        orderSessions.push(orderSession);

        const order = new Order(
          -1,
          orderSessions,
          0,
          0,
          null,
          null,
          new Date().toLocaleString(),
          0,
          0,
          this.tableId,
          'Not Ordered',
          null,
          null,
          '',
          null,
          this.userName
        );

        this.order = order;
      } else {
        let orderSession = this.order.OrderSessions.find(x => x.CurrentState === 'Not Ordered');
        if (orderSession === undefined) {

          const orderedItems: OrderedItem[] = [];
          orderedItems.push(orderedItem);

          orderSession = new OrderSession(
            null,
            null,
            orderedItems,
            'Not Ordered'
          );

          this.order.OrderSessions.push(orderSession);


        } else {
          const existingOrderedItem = this.pointOfSaleService.checkIfOrderedItemExist(foodItemId, orderSession.OrderedItems);

          if (existingOrderedItem === null) {
              orderSession.OrderedItems.push(orderedItem);

          } else {
              existingOrderedItem.FoodItemQuantity += quantity;
              existingOrderedItem.TotalPrice += subTotal;

          }
        }
      }

      this.order.TotalPrice += subTotal;
      this.order.InventoryCost +=  (foodItem.InventoryCost * quantity);

    } else {
      if (this.order === undefined) {
        return;
      }

      const orderSession = this.order.OrderSessions.find(x => x.CurrentState === 'Not Ordered');
      if (orderSession === null) {
        return;
      }

      const existingOrderedItem = this.pointOfSaleService.checkIfOrderedItemExist(foodItemId, orderSession.OrderedItems);
      if (existingOrderedItem === null) {
        return;
      }

      if (quantity > existingOrderedItem.FoodItemQuantity)  {
        this.toastr.errorToastr('Value is too big', 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        return;
      }

      existingOrderedItem.FoodItemQuantity -= quantity;
      existingOrderedItem.TotalPrice -= subTotal;
      this.order.TotalPrice -= subTotal;
      this.order.InventoryCost -=  (foodItem.InventoryCost * quantity);
      this.order.Profit -= (this.order.TotalPrice - this.order.InventoryCost);

      if (existingOrderedItem.FoodItemQuantity === 0) {
        const index = orderSession.OrderedItems.findIndex(x => x.FoodItemId === existingOrderedItem.FoodItemId);
        orderSession.OrderedItems.splice(index, 1);
      }
    }
  }


  getFoodItemInformation(type: string, foodItemId: number) {
    const foodItem = this.foodItems.find(x => x.Id === foodItemId);
    if (foodItem === undefined || foodItem === null) {
      return '';
    }
    if (type === 'Name and Serial') {
      return foodItem.SerialNumber + '. ' + foodItem.Name;
    }
    if (type === 'Price') {
      return foodItem.Price;
    }
  }


  updateCartFromSerialNumber(form: NgForm, isAddToCart: boolean) {
    const serialNumber  = form.value.serialNumber;
    const quantity  = form.value.quantity;
    const foodItem = this.foodItems.find(x => x.SerialNumber === serialNumber);

    if (foodItem === undefined) {
      this.toastr.errorToastr('Wrong Serial Number', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return;
    }

    this.updateCart(foodItem, isAddToCart, null , quantity)
  }

  removeFromCart(index: number, orderedItems: OrderedItem[]) {
    this.order.TotalPrice -= orderedItems[index].TotalPrice;
    orderedItems.splice(index, 1);
  }

  placeOrder() {

    const dialog = confirm('Place this order?');
    if (!dialog) {
      return;
    }

    this.orderDataStorageService.placeOrder(this.order).subscribe((data: any) => {
      if (data === '') {
        this.toastr.errorToastr('Try again later', 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        return;
      }

      if (data.Text === 'Insufficient inventories') {
        this.toastr.errorToastr(data.Text, 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        return;
      }

      if (data.Text === 'Order placed successfully') {
        this.toastr.successToastr(data.Text, 'Success', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        this.table.CurrentState = 'Ordered';
        this.order = data.Order;
        return;
      }


    });
  }

  serveOrder(orderSession: OrderSession) {
    const dialog = confirm('Serve this order?');
    if (!dialog) {
      return;
    }

    this.orderDataStorageService.serveOrder(orderSession).subscribe( (data: any) => {
      if (data === 'Order served successfully') {
        this.toastr.successToastr(data, 'Success', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        orderSession.CurrentState = 'Served';
        this.order.CurrentState = 'Served';
        this.table.CurrentState = 'Served';
      }

      if (data === 'Order not found') {
        this.toastr.errorToastr(data, 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
      }
    });
  }

  cancelOrder(orderSession: OrderSession) {
    const dialog = confirm('Cancel this order?');
    if (!dialog) {
      return;
    }

    this.orderDataStorageService.cancelOrder(orderSession).subscribe((data: any) => {

      for (let i = 0; this.order.OrderSessions.length; i++) {
          if (this.order.OrderSessions[i].Id === orderSession.Id) {

            this.order.OrderSessions[i].OrderedItems.forEach((value) => {
              this.order.TotalPrice -= value.TotalPrice;
            });

            this.order.OrderSessions.splice(i, 1);
            break;
          }
        }

        if (this.order.OrderSessions.length === 0) {
          this.order = undefined;
          this.table.CurrentState = 'Empty';
        } else {
          const lastIndex = this.order.OrderSessions.length - 1;
          this.order.CurrentState = this.order.OrderSessions[lastIndex].CurrentState;
          this.table.CurrentState = this.order.CurrentState;
        }

      this.toastr.successToastr('Order canceled successfully', 'Success', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });

    });
  }

  getSessionTotalPrice(orderSession: OrderSession) {
    let totalPrice = 0;
    orderSession.OrderedItems.forEach((value) => { totalPrice += value.TotalPrice; });
    return totalPrice;
  }

  clearOrderSession(index: number) {
    const answer = confirm('Clear order list?');
    if (answer) {

      this.order.OrderSessions[index].OrderedItems.forEach((value) => {
        this.order.TotalPrice -= value.TotalPrice;
      });
      this.order.OrderSessions.splice(index, 1);

      if (this.order.OrderSessions.length === 0) {
        this.order.OrderSessions = [];
        this.order = undefined;
      }
    }
  }




}
