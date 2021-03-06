import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './modules/app-routing.module';
import {PointOfSaleService} from './services/shared/point-of-sale.service';
import {TableDataStorageService} from './services/data-storage/table-data-storage.service';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import {TablesResolverService} from './route-resolvers/tables-resolver.service';
import {OrdersResolverService} from './route-resolvers/orders-resolver.service';
import {InventoriesResolverService} from './route-resolvers/inventories-resolver.service';
import {AuthGuard} from './auth/auth.guard';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth.interceptor';
import {UserAccountsResolverService} from './route-resolvers/user-accounts-resolver.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressRouterModule} from '@ngx-progressbar/router';
import {AppUiModule} from './modules/app-ui.module';
import {PointOfSaleComponent} from './components/point-of-sale/point-of-sale.component';
import {AdminComponent} from './components/admin/admin.component';
import {UsersComponent} from './components/admin/users/users.component';
import {LoginComponent} from './components/login/login.component';
import {PaymentComponent} from './components/point-of-sale/payment/payment.component';
import {TablesComponent} from './components/admin/tables/tables.component';
import {AddNewTableComponent} from './components/admin/tables/add-new-table/add-new-table.component';
import {OrdersComponent} from './components/admin/orders/orders.component';
import {EditTableComponent} from './components/admin/tables/edit-table/edit-table.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {NewPasswordComponent} from './components/new-password/new-password.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {ForbiddenComponent} from './components/forbidden/forbidden.component';
import {HeaderComponent} from './components/header/header.component';
import {InventoriesComponent} from './components/admin/inventories/inventories.component';
import {EditFoodItemComponent} from './components/admin/food-items/edit-food-item/edit-food-item.component';
import {EditInventoryItemComponent} from './components/admin/inventories/edit-inventory-item/edit-inventory-item.component';
import {AddNewFoodItemComponent} from './components/admin/food-items/add-new-food-item/add-new-food-item.component';
import {MenuComponent} from './components/point-of-sale/menu/menu.component';
import { SelectTableComponent } from './components/point-of-sale/select-table/select-table.component';
import { TableListComponent } from './components/admin/tables/table-list/table-list.component';
import { TableDetailsComponent } from './components/admin/tables/table-details/table-details.component';
import {OrderListComponent} from './components/admin/orders/order-list/order-list.component';
import {InventoryListComponent} from './components/admin/inventories/inventory-list/inventory-list.component';
import {InventoryDetailsComponent} from './components/admin/inventories/inventory-details/inventory-details.component';
import {OrderDetailsComponent} from './components/admin/orders/order-details/order-details.component';
import {FoodItemDetailsComponent} from './components/admin/food-items/food-item-details/food-item-details.component';
import {FoodItemListComponent} from './components/admin/food-items/food-item-list/food-item-list.component';
import {AddNewInventoryItemComponent} from './components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component';
import {FoodItemsComponent} from './components/admin/food-items/food-items.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AdminService} from './services/shared/admin.service';
import {HttpErrorInterceptor} from './http-error-interceptor/http-error.interceptor';
import {InventoryDataStorageService} from './services/data-storage/inventory-data-storage.service';
import { ToastrModule } from 'ng6-toastr-notifications';
import {FoodItemDataStorageService} from './services/data-storage/food-item-data-storage.service';
import {OrderDataStorageService} from './services/data-storage/order-data-storage.service';
import {UserAccountDataStorageService} from './services/data-storage/user-account-data-storage.service';
import { AddNewUserComponent } from './components/admin/users/add-new-user/add-new-user.component';
import { UserDetailsComponent } from './components/admin/users/user-details/user-details.component';
import { UserListComponent } from './components/admin/users/user-list/user-list.component';
import { EditUserComponent } from './components/admin/users/edit-user/edit-user.component';
import {RolesResolverService} from './route-resolvers/roles-resolver.service';
import { ChangePasswordByAdminComponent } from './components/admin/users/change-password-by-admin/change-password-by-admin.component';
import { SettingsComponent } from './components/admin/settings/settings.component';
import { SettingListComponent } from './components/admin/settings/setting-list/setting-list.component';
import { EditSettingComponent } from './components/admin/settings/edit-setting/edit-setting.component';
import {SettingResolverService} from './route-resolvers/setting-resolver.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {NgxPrintModule} from 'ngx-print';
import { RemoveInventoryQuantityComponent } from './components/admin/inventories/remove-inventory-quantity/remove-inventory-quantity.component';
import {TableResolverService} from './route-resolvers/table-resolver.service';
import {FoodItemResolverService} from './route-resolvers/food-item-resolver.service';
import {FoodItemsResolverService} from './route-resolvers/food-items-resolver.service';
import {UserAccountResolverService} from './route-resolvers/user-account-resolver.service';
import {InventoryResolverService} from './route-resolvers/inventory-resolver.service';
import {OrderResolverService} from './route-resolvers/order-resolver.service';
import {AddInventoryQuantityComponent} from './components/admin/inventories/add-inventory-quantity/add-inventory-quantity.component';
import { CancelledOrdersComponent } from './components/admin/cancelled-orders/cancelled-orders.component';
import { CancelledOrdersListComponent } from './components/admin/cancelled-orders/cancelled-orders-list/cancelled-orders-list.component';
import { CancelledOrdersDetailsComponent } from './components/admin/cancelled-orders/cancelled-orders-details/cancelled-orders-details.component';
import {OrderCancellationOptionComponent} from './bottom-sheets/order-cancellation-option/order-cancellation-option.component';
import { OrderCancellationReasonComponent } from './bottom-sheets/order-cancellation-reason/order-cancellation-reason.component';
import {CancelledOrderedItemsResolverService} from './route-resolvers/cancelled-ordered-items-resolver.service';
import {CancelledOrderedItemResolverService} from './route-resolvers/cancelled-ordered-item-resolver.service';
import {OverrideInventoryPriceComponent} from './components/admin/inventories/override-inventory-price/override-inventory-price.component';



@NgModule({
  declarations: [
    AppComponent,
    PointOfSaleComponent,
    LoginComponent,
    UsersComponent,
    AdminComponent,
    InventoriesComponent,
    MenuComponent,
    MenuComponent,
    AddNewFoodItemComponent,
    EditFoodItemComponent,
    EditInventoryItemComponent,
    FilterPipe,
    PaymentComponent,
    TablesComponent,
    AddNewTableComponent,
    AddNewInventoryItemComponent,
    OrdersComponent,
    OrderListComponent,
    OrderDetailsComponent,
    FoodItemsComponent,
    FoodItemListComponent,
    FoodItemDetailsComponent,
    InventoryListComponent,
    InventoryDetailsComponent,
    AddInventoryQuantityComponent,
    EditTableComponent,
    PageNotFoundComponent,
    ForbiddenComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
    HeaderComponent,
    SelectTableComponent,
    TableListComponent,
    TableDetailsComponent,
    AddNewUserComponent,
    UserDetailsComponent,
    UserListComponent,
    EditUserComponent,
    ChangePasswordByAdminComponent,
    SettingsComponent,
    SettingListComponent,
    EditSettingComponent,
    OrderCancellationOptionComponent,
    RemoveInventoryQuantityComponent,
    CancelledOrdersComponent,
    CancelledOrdersListComponent,
    CancelledOrdersDetailsComponent,
    OrderCancellationReasonComponent,
    OverrideInventoryPriceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AppUiModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    HttpClientModule,
    NgProgressHttpModule,
    NgProgressRouterModule,
    NgProgressModule.withConfig({
      color: '#6a7ce6',
      min: 20,
      spinner: false,
      meteor: false
    }),
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxPrintModule
  ],

  providers: [
    PointOfSaleService,
    AdminService,
    TableDataStorageService,
    InventoryDataStorageService,
    FoodItemDataStorageService,
    OrderDataStorageService,
    UserAccountDataStorageService,
    TablesResolverService,
    OrderResolverService,
    OrdersResolverService,
    InventoriesResolverService,
    FoodItemResolverService,
    FoodItemsResolverService,
    RolesResolverService,
    CancelledOrderedItemsResolverService,
    CancelledOrderedItemResolverService,
    SettingResolverService,
    UserAccountsResolverService,
    UserAccountResolverService,
    InventoryResolverService,
    TableResolverService,
    AuthGuard,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
