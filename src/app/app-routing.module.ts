import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "./gaurds/auth.guard";
import { AttendanceCreateComponent } from "./components/attendance-create/attendance-create.component";
import { OrderListComponent } from "./components/order-list/order-list.component";
import { OrderCreateComponent } from "./components/order-create/order-create.component";
import { SearchComponent } from "./components/search/search.component";
import { AttendanceListComponent } from "./components/attendance-list/attendance-list.component";
import { EmployeeCreateComponent } from "./components/employee-create/employee-create.component";
import { ClientCreateComponent } from "./components/client-create/client-create.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ItemComponent } from "./components/item/item.component";
import { OrderStatusComponent } from "./components/order-status/order-status.component";
import { PaymentStatusComponent } from "./components/payment-status/payment-status.component";
import { SummaryComponent } from "./components/summary/summary.component";
import { EmployeeTableComponent } from "./components/employee-table/employee-table.component";
import { ClientTableComponent } from "./components/client-table/client-table.component";
import { ItemTableComponent } from "./components/item-table/item-table.component";
import { TodayDeliveredComponent } from "./components/today-order-delivered/today-delivered.component";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { LoginGuard } from "./gaurds/login.guard";
import { TodayReceivedComponent } from "./components/today-received/today-received.component";
import { AssetCreateComponent } from "./components/asset-create/asset-create.component";
import { AssetListComponent } from "./components/asset-list/asset-list.component";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { IncomeCreateComponent } from "./components/income-create/income-create.component";
import { IncomeListComponent } from "./components/income-list/income-list.component";
import { PurchaseCreateComponent } from "./components/purchase-create/purchase-create.component";
import { PurchaseListComponent } from "./components/purchase-list/purchase-list.component";
import { ExpenseCreateComponent } from "./components/expense-create/expense-create.component";
import { ExpenseListComponent } from "./components/expense-list/expense-list.component";
import { PeticashListComponent } from "./components/peticash-list/peticash-list.component";
import { PeticashCreateComponent } from "./components/peticash-create/peticash-create.component";
import { SaleInvoiceComponent } from "./components/sale-invoice/sale-invoice.component";
import { CashSaleComponent } from "./components/cash-sale/cash-sale.component";
import { InstantInvoiceComponent } from "./components/instant-invoice/instant-invoice.component";

const routes: Routes = [
  { path: "", redirectTo: "/welcome", pathMatch: "full" },
  { path: "home", component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: "login",
    component: LoginComponent,
    pathMatch: "full",
    canActivate: [LoginGuard],
  },
  { path: "welcome", component: LandingPageComponent, pathMatch: "full" },
  {
    path: "create",
    component: AttendanceCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: "page", component: PaginationComponent, canActivate: [AuthGuard] },
  {
    path: "attendance-list",
    component: AttendanceListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "employee-list",
    component: EmployeeTableComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "item-list",
    component: ItemTableComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "client-list",
    component: ClientTableComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "employee-create",
    component: EmployeeCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "client-create",
    component: ClientCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: "item-create", component: ItemComponent, canActivate: [AuthGuard] },
  { path: "search", component: SearchComponent, canActivate: [AuthGuard] },
  {
    path: "summary/:summaryType",
    component: SummaryComponent,
    canActivate: [AuthGuard],
  },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "orders", component: OrderListComponent, canActivate: [AuthGuard] },
  {
    path: "orders/create",
    component: OrderCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "income/create",
    component: IncomeCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "income/list",
    component: IncomeListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "purchase/create",
    component: PurchaseCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "purchase/list",
    component: PurchaseListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "expense/create",
    component: ExpenseCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "expense/list",
    component: ExpenseListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "peticash/create",
    component: PeticashCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "peticash/list",
    component: PeticashListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "asset/create",
    component: AssetCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "asset-list",
    component: AssetListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "orders/status/:orderID",
    component: OrderStatusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "orders/payment-status/:orderId",
    component: PaymentStatusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "today/received",
    component: TodayReceivedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "today/delivered",
    component: TodayDeliveredComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "sale-invoice",
    component: SaleInvoiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "cash-sale",
    component: CashSaleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "instant-invoice",
    component: InstantInvoiceComponent,
    canActivate: [AuthGuard],
  },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
