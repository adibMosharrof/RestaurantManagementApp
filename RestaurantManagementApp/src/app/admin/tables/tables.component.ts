import { Component, OnInit } from '@angular/core';
import {Table} from '../../shared/table.model';
import {OurOffersService} from '../../our-offers/our-offers.service';
import {DataStorageService} from '../../shared/data-storage.service';
import {Inventory} from '../../shared/inventory.model';
import {Http} from '@angular/http';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  public tables: Table[] ;
  subscription: Subscription;
  totalTable = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              private _http: Http) { }

  ngOnInit() {
    /*this._dataStorageService.getTables()
      .subscribe(
        (tables: Table[]) => {
          this._ourOfferService.table = tables;
        }
      );*/
   this.route.data.
     subscribe(
     ( data: Table[]) => {
       this._ourOfferService.table = data['tables'];
     }
   );
    this.tables = this._ourOfferService.table;
    this.subscription = this._ourOfferService.tableChanged
      .subscribe(
        (tables: Table[]) => {
          this.tables = tables;
        }
      );
    this.totalTable = this.tables.length;
  }
  addNewTable() {
    this.router.navigate(['admin/tables/add-new-table']);
  }

  editTable(table: Table) {
    this.router.navigate(['admin/tables/edit-table', table.Id]);
  }
  deleteTable(table: Table, index: number) {
    this._dataStorageService.deleteTable(table);
    this.tables.splice(index, 1);
    this._ourOfferService.table.splice(index, 1);
  }
}
