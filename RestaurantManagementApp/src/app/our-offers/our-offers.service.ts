import { Response} from '@angular/http';
import {Http} from '@angular/http';
import { Injectable } from '@angular/core';
import { Uuid } from 'ng2-uuid';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import {OurOffers} from './our-offers.model';
import {DataStorageService} from '../shared/data-storage.service';
import {OrderedItems} from '../shared/ordered-items.model';
import {forEach} from '@angular/router/src/utils/collection';
import {Order} from '../shared/order.model';
import {Inventory} from '../shared/inventory.model';
import {FoodItems} from '../shared/food-item.model';
import {Ingredients} from '../shared/ingredients.model';
import {Table} from '../shared/table.model';


@Injectable()
export class OurOffersService {
  public uuidCodeOne = '';
  public TotalPrice = 0;
  public menuChanged = new Subject<OurOffers>();
  public orderedItemsChanged = new Subject<OrderedItems[]>();
  public menu: OurOffers;
  public totalQuantity  = 0;
  public orderedItems: OrderedItems[] = [];
  public orders: Order;
  public ordersChanged = new Subject<Order>();
  public ordersList: Order[] = [];
  public ordersListChanged = new Subject<Order[]>();
  public acceptedOrder: Order;
  public rejectedOrder: Order;
  public setMenuSubTotal = 0;
  public foodItemSubTotal = 0;
  public inventoryCost = 0;
  ingredients: Ingredients[] = [];
  ingredientsChanged = new Subject<Ingredients[]>();
  FoodItem: FoodItems[] = [];
  foodItemChanged = new Subject<FoodItems[]>();
  public inventory: Inventory[] = [];
  public inventoryChanged = new Subject<Inventory[]>();
  public table: Table[] = [];
  public tableChanged = new Subject<Table[]>();


  constructor(private uuid: Uuid,
            ) { this.uuidCodeOne = this.uuid.v1(); }



   clearOrders() {
    this.orderedItems = [];
   }

   updateInventoryList(inventoryId: string, editedInventoryItem: Inventory) {
    for ( let i = 0; i < this.inventory.length; i++) {
      if ( this.inventory[i].Id === inventoryId ) {
        this.inventory[i].Name = editedInventoryItem.Name;
        this.inventory[i].Price = editedInventoryItem.Price;
        this.inventory[i].Unit = editedInventoryItem.Unit;
        this.inventoryChanged.next(this.inventory.slice());
      }
    }
   }

  addToInventoryList(inventory: Inventory) {
    this.inventory.push(inventory);
    this.inventoryChanged.next(this.inventory.slice());
  }

  addToTableList(table: Table) {
    this.table.push(table);
    this.tableChanged.next(this.table.slice());
  }
  editTable(editedTable: Table) {
    for ( let i = 0; i < this.table.length; i++) {
      if ( this.table[i].Id === editedTable.Id ) {
        this.table[i].Name = editedTable.Name;
        this.tableChanged.next(this.table.slice());
      }
    }
  }


  getInventories() {
    return this.inventory.slice();
  }



  addToFoodItemList(foodItem: FoodItems) {
    this.FoodItem.push(foodItem);
    this.foodItemChanged.next(this.FoodItem.slice());
  }

  updateFoodItemList(editedFoodItem: FoodItems) {
    for ( let i = 0; i< this.FoodItem.length; i++ ) {
      if ( this.FoodItem[i].Id === editedFoodItem.Id ) {
        this.FoodItem[i] = editedFoodItem;
        this.foodItemChanged.next(this.FoodItem.slice());
      }
    }
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  addToIngredientList(ingredient: Ingredients) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  removeFromSetMenuCart(setMenuId: number, quantity: number, subTotal: number) {

    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
        if ( this.orderedItems[i].SetMenuId === setMenuId) {
          this.orderedItems[i].SetMenuQuantity =
            this.orderedItems[i].SetMenuQuantity
            - quantity;

          this.orderedItems[i].SetMenuSubTotal =
            this.orderedItems[i].SetMenuSubTotal
            - subTotal;
          this.TotalPrice -= Number.parseInt(subTotal.toString());
          return this.orderedItems[i].SetMenuQuantity;
        }
     }
  }

  removeFromFoodItemCart(foodItemId: string, quantity: number, subTotal: number) {

    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if ( this.orderedItems[i].FoodItemId === foodItemId) {
        if (this.orderedItems[i].FoodItemQuantity >= quantity) {
          this.orderedItems[i].FoodItemQuantity =
            this.orderedItems[i].FoodItemQuantity
            - quantity;

          this.orderedItems[i].FoodItemSubTotal =
            this.orderedItems[i].FoodItemSubTotal
            - subTotal;
          this.TotalPrice -= Number.parseInt(subTotal.toString());
          this.totalQuantity -= Number.parseInt(quantity.toString());
          if (this.orderedItems[i].FoodItemQuantity === 0) {
            this.orderedItems.splice(i, 1);
          }
        }

      }
    }
  }

  checkIfOrderedItemExist(foodItemId: string, orderId: string) {
    for (let i = 0; i < this.orderedItems.length; i++) {
      if (this.orderedItems[i].FoodItemId === foodItemId
        && this.orderedItems[i].OrderId === orderId) {
        return this.orderedItems[i].OrderItemId;
      }
    }
    return null;
  }


  getOrderedItemsList() {
    return this.orderedItems.slice();
  }

  getAccepted(order: Order) {
    this.acceptedOrder = order;
  }
  getRejected(order: Order) {
    this.rejectedOrder = order;
  }
  getAcceptedOrder() {
    return this.acceptedOrder;
  }

  getRejectedOrder() {
    return this.rejectedOrder;
  }
  deleteOrder(order: Order) {
    for (let i = 0; i < this.ordersList.length; i++ ) {
      if ( this.ordersList[i].Id === order.Id  ) {
        this.ordersList.splice(i, 1);
      }
    }
  }
  addToOrderedItemsList(orderedItems: OrderedItems) {
    this.orderedItems.push(orderedItems);
    this.orderedItemsChanged.next(this.orderedItems.slice());
  }

  addToOrderedList(order: Order) {
    this.orders = order;
    this.ordersChanged.next(order);
    this.ordersList.push(order);
    this.ordersListChanged.next(this.ordersList.slice());
  }

  grandTotalPrice(price: number) {
     this.TotalPrice = Number.parseInt(price.toString()) + Number.parseInt(this.TotalPrice.toString());
     return this.TotalPrice;
  }

  SetMenuSubTotalPrice(price: number, quantity: number) {
    this.setMenuSubTotal = Number.parseInt(price.toString()) * Number.parseInt(quantity.toString());
    return this.setMenuSubTotal;
  }

  FoodItemSubTotalPrice(price: number, quantity: number) {
    this.foodItemSubTotal = Number.parseInt(price.toString()) * Number.parseInt(quantity.toString());
    return this.foodItemSubTotal;
  }

   checkExistingSetMenu(setMenuId: number) {
     for (let i = 0 ; i < this.orderedItems.length; i++ ) {
       if (this.orderedItems[i].SetMenuId === setMenuId) {
         return true;
       }
     }
  }

  checkExistingFoodItem(foodItemId: string) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if (this.orderedItems[i].FoodItemId === foodItemId) {
        return true;
      }
    }
  }

  increaseOnExistingSetMenu(setMenuId: number, quantity: number, subTotal: number) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {

      if (this.orderedItems[i].SetMenuId === setMenuId) {

        this.orderedItems[i].SetMenuQuantity =
          Number.parseInt(this.orderedItems[i].SetMenuQuantity.toString())
          + Number.parseInt(quantity.toString());

        this.orderedItems[i].SetMenuSubTotal =
          Number.parseInt(this.orderedItems[i].SetMenuSubTotal.toString())
          + Number.parseInt(subTotal.toString());
      }
    }
  }

  increaseOnExistingFoodItem(foodItemId: string, quantity: number, subTotal: number ) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {

      if (this.orderedItems[i].FoodItemId === foodItemId) {

        this.orderedItems[i].FoodItemQuantity =
          Number.parseInt(this.orderedItems[i].FoodItemQuantity.toString())
          + Number.parseInt(quantity.toString());

        this.orderedItems[i].FoodItemSubTotal =
          Number.parseInt(this.orderedItems[i].FoodItemSubTotal.toString())
          + Number.parseInt(subTotal.toString());
      }
    }
  }
}


