// @ts-nocheck
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { DemoFlexyModule } from "../demo-flexy-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { AttendanceCreateComponent } from "./attendance-create/attendance-create.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { OrderCreateComponent } from "./order-create/order-create.component";
import { SearchComponent } from "./search/search.component";
import { AttendanceListComponent } from "./attendance-list/attendance-list.component";
import { EmployeeCreateComponent } from "./employee-create/employee-create.component";
import { ClientCreateComponent } from "./client-create/client-create.component";
import { ProfileComponent } from "./profile/profile.component";
import { ItemComponent } from "./item/item.component";
import { OrderStatusComponent } from "./order-status/order-status.component";
import { SummaryComponent } from "./summary/summary.component";
import { EmployeeTableComponent } from "./employee-table/employee-table.component";
import { ClientTableComponent } from "./client-table/client-table.component";
import { ItemTableComponent } from "./item-table/item-table.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { TodayDeliveredComponent } from "./today-order-delivered/today-delivered.component";
import { TodayReceivedComponent } from "./today-received/today-received.component";
import { AssetCreateComponent } from "./asset-create/asset-create.component";
import { AssetListComponent } from "./asset-list/asset-list.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { IncomeCreateComponent } from "./income-create/income-create.component";
import { IncomeListComponent } from "./income-list/income-list.component";
import { PurchaseCreateComponent } from "./purchase-create/purchase-create.component";
import { PurchaseListComponent } from "./purchase-list/purchase-list.component";
import { ExpenseCreateComponent } from "./expense-create/expense-create.component";
import { ExpenseListComponent } from "./expense-list/expense-list.component";
import { PeticashListComponent } from "./peticash-list/peticash-list.component";
import { PeticashCreateComponent } from "./peticash-create/peticash-create.component";
import { SearchableDropdownComponent } from "./searchable-dropdown/searchable-dropdown.component";
import { PaymentStatusComponent } from "./payment-status/payment-status.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { ShareLinkDialogComponent } from './sale-invoice/share-link-dialog/share-link-dialog.component';
import { CashSaleComponent } from './cash-sale/cash-sale.component';
import { InstantInvoiceComponent } from './instant-invoice/instant-invoice.component';

@NgModule({
  declarations: [
    LoginComponent,
    AttendanceCreateComponent,
    OrderListComponent,
    OrderCreateComponent,
    SearchComponent,
    AttendanceListComponent,
    EmployeeCreateComponent,
    ClientCreateComponent,
    ProfileComponent,
    ItemComponent,
    OrderStatusComponent,
    SummaryComponent,
    EmployeeTableComponent,
    ClientTableComponent,
    ItemTableComponent,
    LandingPageComponent,
    TodayDeliveredComponent,
    TodayReceivedComponent,
    AssetCreateComponent,
    AssetListComponent,
    PaginationComponent,
    IncomeCreateComponent,
    IncomeListComponent,
    PurchaseCreateComponent,
    PurchaseListComponent,
    ExpenseCreateComponent,
    ExpenseListComponent,
    PeticashListComponent,
    PeticashCreateComponent,
    SearchableDropdownComponent,
    PaymentStatusComponent,
    SaleInvoiceComponent,
    ShareLinkDialogComponent,
    CashSaleComponent,
    InstantInvoiceComponent,
  ],
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  exports: [LandingPageComponent],
})
// @ts-ignore
export class ComponentsModule {}
