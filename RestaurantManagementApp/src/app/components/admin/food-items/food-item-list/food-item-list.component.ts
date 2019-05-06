import {ActivatedRoute} from '@angular/router';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import {FoodItem} from '../../../../models/food-item.model';

@Component({
  selector: 'app-food-item-list',
  templateUrl: './food-item-list.component.html',
  styleUrls: ['./food-item-list.component.scss']
})
export class FoodItemListComponent implements OnInit, AfterViewInit {
  foodItems: FoodItem[] = [];

  displayedColumns: string[] =
    [
      'SerialNumber',
      'Name',
      'Price',
      'InventoryCost',
      'Profit',
      'TotalSale'
    ];
  dataSource: MatTableDataSource<FoodItem>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.foodItems = data['foodItems'];
        this.dataSource = new MatTableDataSource(this.foodItems);

      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}