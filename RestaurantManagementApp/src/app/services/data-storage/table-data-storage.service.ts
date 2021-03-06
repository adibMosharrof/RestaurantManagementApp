import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Table} from '../../models/table.model';

@Injectable()
export class TableDataStorageService {
  backEndPort = '1548';
  rootUrl = 'http://localhost:' + this.backEndPort;

  // rootUrl = 'http://18.190.19.146:5202/';
  
  constructor(private http: HttpClient) { }

  getTable(tableId: number) {
    return this.http.get(`${this.rootUrl + '/api/GetTable'}/${tableId}`);
  }

  getAllTable() {
    return this.http.get<Table[]>(this.rootUrl + '/api/GetAllTable');
  }

  addNewTable(table: Table) {
    return this.http.post<Table>(this.rootUrl + '/api/AddNewTable', table);
  }

  editTable(table: Table) {
    return this.http.put<Table>(this.rootUrl + '/api/EditTable', table);
  }

  deleteTable(tableId: number) {
    return this.http.delete(`${this.rootUrl + '/api/DeleteTable'}/${tableId}`);
  }

  changeTableState(table: Table) {
    return this.http.put<Table>(this.rootUrl + '/api/ChangeTableState', table);
  }
}
