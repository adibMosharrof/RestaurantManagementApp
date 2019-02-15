import {OurOffersService} from '../../../services/our-offers.service';
import {DataStorageService} from '../../../services/data-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {FoodItems} from '../../../models/food-item.model';
import {Inventory} from '../../../models/inventory.model';
import {Subject, Subscription} from 'rxjs';
import {Ingredients} from '../../../models/ingredients.model';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'app-add-new-food-item',
  templateUrl: './add-new-food-item.component.html',
  styleUrls: ['./add-new-food-item.component.scss']
})

export class AddNewFoodItemComponent implements OnInit {
  uuidCodeOne = '';
  name: string;
  price: number;
  foodItemId : string;
  @ViewChild('newFoodItem') form: NgForm;
  salePrice = 0;
  profit = 0;
  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];
  ingredientsChanged = new Subject<Ingredients[]>();
  unit: number;
  inventoryCost = 0;
  checkIfEmpty = 0;
  isDisabled = false;
  subscription: Subscription;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private ourOffersService: OurOffersService,
              private dataStorageService: DataStorageService,
           ) {
    this.uuidCodeOne = UUID.UUID();
  }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.ourOffersService.inventory = data['inventories'];
      }
    );
    this.inventories = this.ourOffersService.inventory;
    this.subscription = this.ourOffersService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
    this.inventoryCost = 0;
    this.checkIfEmpty = this.ourOffersService.inventory.length;
  }



  getInventoryItemName(inventoryId: string) {
    for (let i = 0; i < this.inventories.length; i++) {
      if ( this.inventories[i].Id === inventoryId) {
        return this.inventories[i].Name;
      }
    }
  }
  getInventoryItemUnit(inventoryId: string) {
    for (let i = 0; i < this.inventories.length; i++) {
      if ( this.inventories[i].Id === inventoryId) {
        return this.inventories[i].Unit;
      }
    }
  }
  getInventoryItemPrice(inventoryId: string) {
    for (let i = 0; i < this.inventories.length; i++) {
      if ( this.inventories[i].Id === inventoryId) {
        return this.inventories[i].AveragePrice;
      }
    }
  }

  checkIfIngredientsExist(inventoryId: string) {
    for (let i = 0; i < this.ingredients.length; i++) {
      if (this.ingredients[i].InventoryId === inventoryId) {
        return i;
      }
    }
    return '';
  }

  onAddIngredients(form: NgForm) {
    const ingredientId = UUID.UUID();
    const inventoryId = form.value.ingName;
    let quantity = form.value.quantity;
    const inventoryPrice = this.getInventoryItemPrice(inventoryId);
    let subTotal = quantity * inventoryPrice;

    if (this.checkIfIngredientsExist(inventoryId) !== '') {
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].Quantity
        += Number.parseFloat(quantity.toString());
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].SubTotal
        += Number.parseFloat(subTotal.toString());

    } else {
      const name = this.getInventoryItemName(inventoryId);
      const inventoryUnit = this.getInventoryItemUnit(inventoryId);
      const foodItemId = '';
      subTotal = Number.parseFloat(subTotal.toFixed(2));
      quantity = Number.parseFloat(quantity.toFixed(2));
      const addIngredient = new Ingredients(ingredientId, name, quantity,
        inventoryUnit, inventoryId, inventoryPrice, subTotal, foodItemId);
      this.ingredients.push(addIngredient);
      this.ingredientsChanged.next(this.ingredients.slice());
    }
      this.inventoryCost = this.inventoryCost
        + subTotal;
    form.controls['quantity'].reset();
}

  deleteIngredient(ingredient: Ingredients, index: number) {
    for (let i = 0; i < this.ingredients.length; i++) {
      if (this.ingredients[i].Id === ingredient.Id ) {
        this.inventoryCost -= this.ingredients[i].SubTotal;
      }
    }
    this.ingredients.splice(index, 1);
  }






  onSaveFoodItem(form: NgForm) {
    this.isDisabled = true;
    const name = form.value.itemName;
    const serialNumber= form.value.serial;
    const price = form.value.salePrice;
    const foodItemIngredients = this.ingredients;
    const foodItemId = UUID.UUID();
    const profit = price - this.inventoryCost;
    for (let i = 0; i < this.ingredients.length; i++) {
      this.ingredients[i].FoodItemId = foodItemId;
    }
    const newFoodItem =
      new FoodItems(foodItemId, serialNumber, name, price, this.inventoryCost, profit, 0 ,
      null, foodItemIngredients );


    this.dataStorageService.addFoodItem(newFoodItem).
    subscribe(
      (data: any) => {

        this.ourOffersService.addToFoodItemList(newFoodItem);
        this.form.reset();
        this.router.navigate(['admin/food-item/add-food-item-image', foodItemId]);
      }
    );
  }


  cancel() {
    this.router.navigate(['admin/food-item/grid-view']);
  }
}
