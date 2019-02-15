import { Component, OnInit } from '@angular/core';
import {OurOffersService} from '../../../../services/our-offers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FoodItems} from '../../../../models/food-item.model';
import {DataStorageService} from '../../../../services/data-storage.service';
import {Ingredients} from '../../../../models/ingredients.model';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit {

  rootUrl = '';
  imageUrl = 'assets/images/noImage.png';
  FoodItemList: FoodItems[] = [];
  Ingredients: Ingredients[] = [];
  FoodItem: FoodItems;
  foodItemId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private ourOffersService: OurOffersService,
             ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = params['id'];
        }
      );
  }

  ngOnInit() {
    this.rootUrl = this.dataStorageService.rootUrl + '/Content/';
    this.route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this.ourOffersService.FoodItem = data['foodItems'];
      }
    );
    this.FoodItemList = this.ourOffersService.FoodItem;
    this.ourOffersService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItemList = FoodItem;
        }
      );
    for (let i = 0; i < this.FoodItemList.length; i++) {
      if (this.FoodItemList[i].Id === this.foodItemId) {
        this.FoodItem = this.FoodItemList[i];
        if ( this.FoodItem.FoodItemImage === null || this.FoodItem.FoodItemImage === '' ) {
          this.FoodItem.FoodItemImage = this.imageUrl;
        } else {
          this.FoodItem.FoodItemImage =  this.rootUrl + this.FoodItem.FoodItemImage;
        }
      }
    }
  }
  goBack() {
    this.router.navigate(['admin/food-item/list-view']);
  }
  edit() {
    this.router.navigate(['admin/food-item/edit-food-item', this.foodItemId]);
  }

  confirmEvent() {
    this.dataStorageService.deleteFoodItem(this.FoodItem).subscribe(
      (data: any) => {
        for (let i = 0; i < this.FoodItemList.length; i++) {
          if (this.FoodItemList[i].Id === this.foodItemId) {
            this.ourOffersService.FoodItem.splice(i, 1);
          }
        }
        this.router.navigate(['admin/food-item/list-view']);
      }
    );
  }

  deleteFoodItem() {
    const dialog = confirm('Delete this item?\n' +
      'You will lose any kind of data associated with the current item!');
    if (dialog === true) {
      this.confirmEvent();
    }
  }

  changeImage() {
    this.router.navigate(['admin/food-item/edit-food-item-image', this.foodItemId]);
  }
}
