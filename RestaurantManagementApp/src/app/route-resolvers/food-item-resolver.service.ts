import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {FoodItem} from '../models/food-item.model';
import {FoodItemDataStorageService} from '../services/data-storage/food-item-data-storage.service';

@Injectable()
export class FoodItemResolverService  implements Resolve<FoodItem[]> {

  constructor(private foodItemDataStorageService: FoodItemDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FoodItem[]> |
    Promise<FoodItem[]> | FoodItem[] {
    return this.foodItemDataStorageService.getAllFoodItem();
  }

}
