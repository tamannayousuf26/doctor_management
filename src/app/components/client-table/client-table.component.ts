// @ts-nocheck
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { OrderService } from "../../services/order.service";
import { ClientService } from "../../services/client.service";
import { AlertMessageService } from "../../services/alert-message.service";

export enum ClientStatus {
  Inactive = 0,
  Active = 1,
}

@Component({
  selector: "app-client-table",
  templateUrl: "./client-table.component.html",
  styleUrls: ["./client-table.component.scss"],
})
export class ClientTableComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "name",
    "doctor_name",
    "due",
    "advance",
    "phone",
    "address",
    "status",
    "actions",
  ];
  dataSource: MatTableDataSource<any>;
  clientList: any;
  searchText: string = "";
  selectedStatus: string = "all";

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;

  constructor(
    private _router: Router,
    private _orderService: OrderService,
    private _clientService: ClientService,
    private _alertMsg: AlertMessageService
  ) {
    this.clientList = [];
    this.dataSource = new MatTableDataSource(this.clientList);
  }

  ngOnInit(): void {
    this.getClientList();
  }

  getClientList() {
    this._orderService.getClientList().subscribe((resp: any) => {
      this.clientList = [];
      this.clientList = resp;
      this.dataSource = new MatTableDataSource(this.clientList);
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const filterObj = JSON.parse(filter);
        const searchStr = filterObj.search.toLowerCase();
        const statusFilter = filterObj.status;

        const matchesSearch =
          !searchStr ||
          data.client_no?.toLowerCase().includes(searchStr) ||
          data.name?.toLowerCase().includes(searchStr) ||
          data.doctor_name?.toLowerCase().includes(searchStr) ||
          data.phone?.toLowerCase().includes(searchStr) ||
          data.address?.toLowerCase().includes(searchStr);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && (data.status === 1 || data.status === "1")) ||
          (statusFilter === "inactive" && (data.status === 0 || data.status === "0"));

        return matchesSearch && matchesStatus;
      };
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  editClient(clientId: any) {
    this._router
      .navigate(["client-create"], { queryParams: { clientId: clientId } })
      .then();
  }

  createClient() {
    this._router.navigateByUrl("/client-create").then(() => console.log(""));
  }

  applyFilter(e: any): void {
    this.searchText = e.value.trim();
    this.applyFilters();
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    const filterObj = {
      search: this.searchText,
      status: this.selectedStatus,
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  getStatusClass(status: any): string {
    return status === 1 || status === "1" ? "status-active" : "status-inactive";
  }

  getStatusText(status: any): string {
    return status === 1 || status === "1" ? "Active" : "Inactive";
  }

  changeClientStatus(client: any) {
    const currentStatus = client.status === 1 || client.status === "1" ? 1 : 0;
    const newStatus = currentStatus === 1 ? 0 : 1;
    const newStatusText = newStatus === 1 ? "Active" : "Inactive";

    this._alertMsg
      .confirmClientStatusChangeAlert(newStatusText, client.name)
      .then((confirmed: any) => {
        if (confirmed) {
          const payload = { id: client.id, status: newStatus };
          this._clientService.changeClientStatus(payload).subscribe(
            (resp: any) => {
              this._alertMsg.successToast("Status updated successfully");
              this.getClientList();
            },
            (error: any) => {
              this._alertMsg.submissionErrorAlert();
            }
          );
        }
      });
  }
}
