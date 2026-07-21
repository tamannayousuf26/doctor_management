import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertMessageService } from "../../services/alert-message.service";
import { SearchService } from "../../services/search.service";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "../../services/order.service";
import { MatTableDataSource } from "@angular/material/table";
import { ApiConfig } from "../../utility/apiConfig";
import { DateTimeService } from "../../services/date-time.service";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
  styleUrls: ["./summary.component.scss"],
})
export class SummaryComponent implements OnInit {
  summaryFormGroup!: FormGroup;
  title!: any;
  clientList: any[] = [];
  address!: any;
  startDateString!: any;
  endDateString!: any;
  clientId!: any;
  apiConfig = ApiConfig;
  params!: any;
  workStatusHref = "";
  workHref = "";
  allWorkStatusHref = "";
  allDeliveredWorkStatusHref = "";
  allClinicStatusHref = "";
  allRedoWorkStatusHref = "";

  filterText: string = "";
  filteredData: any[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _alertMsg: AlertMessageService,
    private _searchService: SearchService,
    private _dateTimeService: DateTimeService,
    private _router: Router,
    private _orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.getClientList();
    this.summaryType();
  }

  summaryType() {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.formInit();
      this.address = "";
      this.startDateString = "";
      this.endDateString = "";
      this.filterText = "";
      this.findFilteredData();
      this.params = params.get("summaryType");
      if (this.params == "work-status") {
        this.title = "Report - Work Status Wise Summary";
      } else if (this.params == "work") {
        this.title = "Report - Work Summary";
      } else if (this.params == "all-work-status") {
        this.title = "Report - All Work Status Summary";
      } else if (this.params == "all-delivered-work-status") {
        this.title = "Report - All Delivered Work Status Summary";
      } else if (this.params == "all-clinic-work-status") {
        this.title = "Report - All Clinic Work Status Summary";
      } else if (this.params == "all-redo-work-summary") {
        this.title = "Report - All Redo Work Summary";
      }
    });
  }

  formatHref() {
    this.workStatusHref = `${this.apiConfig.downloadPdfUrl}clients/${this.clientId}/start/${this.startDateString}/end/${this.endDateString}`;
    this.workHref = `${this.apiConfig.downloadPdfUrl}summary/clients/${this.clientId}/start/${this.startDateString}/end/${this.endDateString}`;
    this.allWorkStatusHref = `${this.apiConfig.downloadPdfUrl}summary/all/start/${this.startDateString}/end/${this.endDateString}`;
    this.allDeliveredWorkStatusHref = `${this.apiConfig.downloadPdfUrl}summary/all/delivered/start/${this.startDateString}/end/${this.endDateString}`;
    this.allClinicStatusHref = `${this.apiConfig.downloadPdfUrl}clinic/all/start/${this.startDateString}/end/${this.endDateString}`;
    this.allRedoWorkStatusHref = `${this.apiConfig.downloadPdfUrl}summary/redo/start/${this.startDateString}/end/${this.endDateString}`;
  }

  formInit() {
    this.summaryFormGroup = this.formBuilder.group({
      id: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    });
  }

  getClientList() {
    this._orderService.getClientList().subscribe((resp: any) => {
      this.clientList = [];
      this.clientList = resp;
      this.filteredData = resp;
    });
  }

  onChangeClientOption(e: any) {
    this.clientId = e;
    const selected = this.clientList.filter((item: any) => item.id == e);
    this.address = selected[0]["address"];
    this.formatHref();
  }

  onStartDateChange() {
    this.startDateString = this._dateTimeService.getYearMonthDayFormat(
      this.summaryFormGroup.value.startDate
    );
    this.formatHref();
  }

  onEndDateChange() {
    this.endDateString = this._dateTimeService.getYearMonthDayFormat(
      this.summaryFormGroup.value.endDate
    );
    this.formatHref();
  }

  convertDateString(data: any): string {
    let list = data.split("/");
    return list[2] + "-" + list[0] + "-" + list[1];
  }

  /* onSubmit() {
         console.log(this.apiConfig.downloadPdfUrl + `clients/${this.clientId}/start/${this.startDateString}/end/${this.endDateString}`);
     }*/

  applySearch(event: any) {
    this.filterText = event.target.value;
    this.findFilteredData();
  }

  findFilteredData() {
    this.filteredData = this.clientList.filter((item, index) => {
      return index == 0
        ? true
        : item.name
            .toLowerCase()
            .indexOf(this.filterText.trim().toLowerCase()) != -1 ||
            item.doctor_name
              .toLowerCase()
              .indexOf(this.filterText.trim().toLowerCase()) != -1;
    });
  }
}
