import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OurOffers} from '../our-offers.model';
import {Order} from '../../shared/order.model';
import {OurOffersService} from '../our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Popup} from 'ng2-opd-popup';
import {OrderedItems} from '../../shared/ordered-items.model';
import { Uuid } from 'ng2-uuid';

@Component({
  selector: 'app-food-items',
  templateUrl: './food-items.component.html',
  styleUrls: ['./food-items.component.scss']
})
export class FoodItemsComponent implements OnInit {
  @Input() menu: OurOffers;
  @Input() index: number;

  order: Order[];
  condition = false;
  @ViewChild('amountInput') amountInputRef: ElementRef;

  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  constructor(private _ourOfferService: OurOffersService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid,
              private popUp: Popup
  ) {
    this.uuidCodeOne = this.uuid.v1();
    this.uuidCodeTwo = this.uuid.v1();
    this.uuidCodeThree = this.uuid.v1();
  }

  ngOnInit() {
  }


  AddToCart(id: number, price: number, name: string) {
    let orderItemId = this.uuidCodeOne;
    let orderId = this._ourOfferService.uuidCodeOne;
    let quantity = this.amountInputRef.nativeElement.value;
    let foodItemId = id;
    let FoodItemName = name;
    let Price = price;
    let subTotal = this._ourOfferService.FoodItemSubTotaLPrice(Price, quantity);
    this._ourOfferService.grandTotalPrice(subTotal);
    this.condition = this._ourOfferService.checkExistingFoodItem(foodItemId);

    if ( this.condition  ) {
      this._ourOfferService.increaseOnExistingFoodItem(foodItemId, quantity, subTotal );
    } else {
      const purchasedFood = new OrderedItems(orderItemId, orderId,  foodItemId, null, quantity, null, null, name,  price, null, subTotal);
      this._ourOfferService.addToOrderedItemsList(purchasedFood);
    }
    this._ourOfferService.totalQuantity =
      Number.parseInt(this._ourOfferService.totalQuantity.toString())
      + Number.parseInt(this.amountInputRef.nativeElement.value.toString());

  }
}