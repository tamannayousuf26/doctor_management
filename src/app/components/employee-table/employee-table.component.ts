// @ts-nocheck
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { OrderService } from "../../services/order.service";
import { EmployeeService } from "../../services/employee.service";
import { AlertMessageService } from "../../services/alert-message.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

export interface TableElement {
  id: number;
  employee_no: string;
  nid: string;
  name: string;
  phone: string;
  address: string;
  status: number;
}

export enum EmployeeStatus {
  0 = "Inactive",
  1 = "Active",
}

const ELEMENT_DATA: TableElement[] = [];

@Component({
  selector: "app-employee-table",
  templateUrl: "./employee-table.component.html",
  styleUrls: ["./employee-table.component.scss"],
})
export class EmployeeTableComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "name",
    "phone",
    "address",
    "status",
    "actions",
  ];
  dataSource: MatTableDataSource<TableElement>;
  employeeList: TableElement[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;

  constructor(
    private _router: Router,
    private _orderService: OrderService,
    private _employeeService: EmployeeService,
    private _alertMsg: AlertMessageService
  ) {
    this.employeeList = ELEMENT_DATA;
    this.dataSource = new MatTableDataSource(this.employeeList);
  }

  ngOnInit(): void {
    this.getEmployeeList();
  }

  getEmployeeList() {
    this._orderService.getEmployeeList().subscribe((resp: any) => {
      this.employeeList = [];
      this.employeeList = resp;
      this.employeeList.forEach((item: TableElement) => {
        item.status = EmployeeStatus[item.status];
      });
      this.dataSource = new MatTableDataSource(this.employeeList);
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchStr = filter.toLowerCase();
        return (
          data.employee_no?.toLowerCase().includes(searchStr) ||
          data.name?.toLowerCase().includes(searchStr) ||
          data.phone?.toLowerCase().includes(searchStr) ||
          data.address?.toLowerCase().includes(searchStr)
        );
      };
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  createEmployee() {
    this._router.navigateByUrl("/employee-create").then(() => console.log(""));
  }

  editEmployee(employeeId: any) {
    this._router
      .navigate(["employee-create"], { queryParams: { employeeId: employeeId } })
      .then();
  }

  applyFilter(e: any): void {
    const filterValue = e.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      default:
        return "status-default";
    }
  }

  changeEmployeeStatus(employee: TableElement) {
    const currentStatus = employee.status?.toLowerCase() === "active" ? 1 : 0;
    const newStatus = currentStatus === 1 ? 0 : 1;
    const newStatusText = newStatus === 1 ? "Active" : "Inactive";

    this._alertMsg
      .confirmEmployeeStatusChangeAlert(newStatusText, employee.name)
      .then((confirmed: any) => {
        if (confirmed) {
          const payload = {
            id: employee.id,
            status: newStatus,
          };

          this._employeeService.changeEmployeeStatus(payload).subscribe(
            (resp: any) => {
              this._alertMsg.successToast(
                `Employee status changed to ${newStatusText}`
              );
              this.getEmployeeList();
            },
            (error: any) => {
              this._alertMsg.submissionErrorAlert();
              console.error("Error updating employee status:", error);
            }
          );
        }
      });
  }
}
