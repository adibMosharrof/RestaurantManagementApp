import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../services/our-offers.service';
import {DataStorageService} from '../../../services/data-storage.service';
import {FoodItems} from '../../../models/food-item.model';

@Component({
  selector: 'app-edit-food-item-image',
  templateUrl: './edit-food-item-image.component.html',
  styleUrls: ['./edit-food-item-image.component.scss']
})
export class EditFoodItemImageComponent implements OnInit {
  foodItemId : string;
  fileToUpload: File = null;
  imageUrl = '';
  foodItems: FoodItems[] = [];
  rootUrl = '';
  isDisabled = false;
  @ViewChild('Image') Image: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ourOffersService: OurOffersService,
              private dataStorageService: DataStorageService,
  ) {this.route.params
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
    this.foodItems = this.ourOffersService.FoodItem;
    for (let i = 0; i < this.foodItems.length; i++) {
      if (this.foodItems[i].Id === this.foodItemId) {
        if ( this.foodItems[i].FoodItemImage === null || this.foodItems[i].FoodItemImage === '' ) {
          this.imageUrl = '/assets/images/noImage.png';
        } else {
          this.imageUrl = this.rootUrl + this.foodItems[i].FoodItemImage;
        }
      }
    }
  }
  saveFoodItemImage(Image) {
    this.isDisabled = true;
    this.dataStorageService.saveFoodItemImage(this.foodItemId, this.fileToUpload).subscribe(
      data => {

        console.log('done');
        Image.value = null;
        this.imageUrl = '/assets/noImage.png';
        this.router.navigate(['admin/food-item/grid-view']);
      }
    );
  }

  skipFoodItemImage() {
    this.router.navigate(['admin/food-item/grid-details', this.foodItemId]);
  }

  handleFileInput(file: FileList) {
    const fileExtension = file.item(0).name.split('.').pop();

    if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
      this.isDisabled = false;
      this.fileToUpload = file.item(0);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
    } else {
      this.Image.value = '';
      this.isDisabled = true;
      alert('Unsupported image format');
    }

  }
}
