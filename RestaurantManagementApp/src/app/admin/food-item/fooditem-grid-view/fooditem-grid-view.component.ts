import { Component, OnInit } from '@angular/core';
import {FoodItems} from '../../../shared/food-item.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../../shared/data-storage.service';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {Http} from '@angular/http';

@Component({
  selector: 'app-fooditem-grid-view',
  templateUrl: './fooditem-grid-view.component.html',
  styleUrls: ['./fooditem-grid-view.component.scss']
})
export class FooditemGridViewComponent implements OnInit {

  FoodItem: FoodItems[] = [];
  total: number;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
            ) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this._ourOfferService.FoodItem = data['foodItems'];
      }
    );
    this.FoodItem = this._ourOfferService.FoodItem;
    this._ourOfferService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItem = FoodItem;
        }
      );
    this.total =  this.FoodItem.length;
  }
  viewDetails(foodItem: FoodItems) {
    const foodItemId =  foodItem.Id;
    this.router.navigate(['admin/food-item/grid-details', foodItemId]);
  }
}
