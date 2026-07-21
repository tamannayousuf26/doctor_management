import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertMessageService } from "../services/alert-message.service";
import { DashboardService, DashboardData } from "../services/dashboard.service";
import { AuthenticationService } from "../services/authentication.service";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexGrid,
  ApexFill,
  ApexTooltip,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: string[];
};

export type DonutChartOptions = {
  series: number[];
  chart: ApexChart;
  labels: string[];
  colors: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: any;
  tooltip: ApexTooltip;
};

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("ordersChart") ordersChart!: ChartComponent;
  @ViewChild("orderValuesChart") orderValuesChart!: ChartComponent;
  @ViewChild("monthlyChart") monthlyChart!: ChartComponent;
  @ViewChild("paymentChart") paymentChart!: ChartComponent;

  dashboardData: DashboardData | null = null;
  selectedYear: number = new Date().getFullYear();
  selectedClientId: number | null = null;
  years: number[] = [];
  clients: any[] = [];
  loading: boolean = false;

  // Client search
  clientFilterText: string = "";
  filteredClientList: any[] = [];

  // ApexCharts options
  public ordersChartOptions!: Partial<ChartOptions>;
  public orderValuesChartOptions!: Partial<ChartOptions>;
  public monthlyChartOptions!: Partial<ChartOptions>;
  public paymentChartOptions!: Partial<DonutChartOptions>;

  constructor(
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _alertMsg: AlertMessageService,
    private _dashboardService: DashboardService,
    private _authService: AuthenticationService
  ) {
    this.generateYears();
  }

  ngOnInit(): void {
    this.showLoginAlertOrNot();
    this.loadActiveClients();
    this.loadDashboardData();
  }

  applyClientSearch(event: any) {
    this.clientFilterText = event.target.value;
    this.filterClientList();
  }

  filterClientList() {
    const searchText = this.clientFilterText.trim().toLowerCase();
    if (!searchText) {
      this.filteredClientList = this.clients;
      return;
    }
    this.filteredClientList = this.clients.filter((item: any) => {
      return Object.values(item).some(
        (value: any) => value && value.toString().toLowerCase().includes(searchText)
      );
    });
  }

  clearClientSearch() {
    this.clientFilterText = "";
    this.filteredClientList = this.clients;
  }

  onClientSelected(clientId: number | null) {
    this.selectedClientId = clientId;
    this.loadDashboardData();
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2023; year--) {
      this.years.push(year);
    }
  }

  showLoginAlertOrNot() {
    this._activateRoute.queryParams.subscribe((params) => {
      if (params.login) {
        this._alertMsg.loginSuccessfulAlert();
      }
    });
  }

  loadActiveClients() {
    this._dashboardService.getActiveClients().subscribe(
      (clients: any) => {
        this.clients = clients;
        this.filteredClientList = clients;
      },
      (error) => this._authService.httpRequestErrorHandler(error)
    );
  }

  loadDashboardData() {
    this.loading = true;

    const apiCall = this.selectedClientId
      ? this._dashboardService.getClientDashboard(
          this.selectedYear,
          this.selectedClientId
        )
      : this._dashboardService.getYearWideDashboard(this.selectedYear);

    apiCall.subscribe(
      (data: DashboardData) => {
        this.dashboardData = data;
        this.prepareChartData();
        this.loading = false;
      },
      (error) => {
        this._authService.httpRequestErrorHandler(error);
        this.loading = false;
      }
    );
  }

  onYearChange(year: number) {
    this.selectedYear = year;
    this.loadDashboardData();
  }

  prepareChartData() {
    if (!this.dashboardData) return;

    // Chart 1: Orders (Created, Delivered, Pending)
    this.ordersChartOptions = {
      series: [
        {
          name: "Orders",
          data: [
            this.dashboardData.overview.total_orders_created,
            this.dashboardData.overview.total_orders_delivered,
            this.dashboardData.overview.total_orders_pending,
          ],
        },
      ],
      chart: {
        type: "bar",
        height: 250,
        width: '100%',
        toolbar: { show: false },
        background: 'transparent',
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          dataLabels: { position: "top" },
          columnWidth: "50%",
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -25,
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          colors: ["#304758"],
        },
      },
      xaxis: {
        categories: ["Created", "Delivered", "Pending"],
        labels: {
          style: {
            fontSize: "12px",
            fontWeight: 600,
            colors: ["#1e3a8a", "#059669", "#d97706"],
          },
        },
      },
      yaxis: {
        title: { text: "Number of Orders" },
      },
      colors: ["#1e3a8a", "#059669", "#d97706"],
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 3,
      },
      fill: {
        type: "solid",
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val) => val + " orders",
        },
      },
    };

    // Chart 2: Order Values (Total, Paid, Due)
    this.orderValuesChartOptions = {
      series: [
        {
          name: "Amount (RM)",
          data: [
            this.dashboardData.overview.total_order_value,
            this.dashboardData.overview.total_paid,
            this.dashboardData.overview.total_due,
          ],
        },
      ],
      chart: {
        type: "bar",
        height: 250,
        width: '100%',
        toolbar: { show: false },
        background: 'transparent',
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          dataLabels: { position: "top" },
          columnWidth: "50%",
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -25,
        formatter: (val) =>
          "RM " + (typeof val === "number" ? val.toFixed(0) : val),
        style: {
          fontSize: "11px",
          fontWeight: "bold",
          colors: ["#304758"],
        },
      },
      xaxis: {
        categories: ["Total", "Paid", "Due"],
        labels: {
          style: {
            fontSize: "12px",
            fontWeight: 600,
            colors: ["#6366f1", "#059669", "#dc2626"],
          },
        },
      },
      yaxis: {
        title: { text: "Amount (RM)" },
        labels: {
          formatter: (val) => "RM " + val.toFixed(0),
        },
      },
      colors: ["#6366f1", "#059669", "#dc2626"],
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 3,
      },
      fill: {
        type: "solid",
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val) => "RM " + val.toFixed(2),
        },
      },
    };

    // Chart 3: Monthly Order Value
    this.monthlyChartOptions = {
      series: [
        {
          name: "Order Value",
          data: this.dashboardData.monthly_breakdown.map((m) => m.order_value),
        },
      ],
      chart: {
        type: "bar",
        height: 250,
        width: '100%',
        toolbar: { show: false },
        background: 'transparent',
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          dataLabels: { position: "top" },
          columnWidth: "60%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: this.dashboardData.monthly_breakdown.map((m) =>
          m.month.substring(0, 3)
        ),
        labels: {
          style: {
            fontSize: "11px",
          },
        },
      },
      yaxis: {
        title: { text: "Amount (RM)" },
        labels: {
          formatter: (val) => "RM " + val.toFixed(0),
        },
      },
      colors: ["#3b82f6"],
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 3,
      },
      fill: {
        type: "solid",
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val) => "RM " + val.toFixed(2),
        },
      },
    };

    // Chart 4: Payment Status Donut
    this.paymentChartOptions = {
      series: [
        this.dashboardData.payment_distribution.paid.value,
        this.dashboardData.payment_distribution.unpaid.value,
      ],
      chart: {
        type: "donut",
        height: 250,
        width: '100%',
        background: 'transparent',
      },
      labels: ["Paid", "Unpaid"],
      colors: ["#10b981", "#ef4444"],
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true,
              name: {
                show: false,
              },
              value: {
                show: true,
                fontSize: "24px",
                fontWeight: 700,
                color: "#10b981",
                formatter: () => {
                  return (
                    this.dashboardData!.payment_distribution.collection_rate.toFixed(
                      0
                    ) + "%"
                  );
                },
              },
              total: {
                show: true,
                label: "Collected",
                fontSize: "12px",
                fontWeight: 400,
                color: "#6b7280",
                formatter: () => {
                  return (
                    this.dashboardData!.payment_distribution.collection_rate.toFixed(
                      0
                    ) + "%"
                  );
                },
              },
            },
          },
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        y: {
          formatter: (val) => "RM " + val.toFixed(2),
        },
      },
    };
  }

  formatCurrency(value: number): string {
    return `RM ${value.toFixed(2)}`;
  }

  getGrowthIcon(percentage: number): string {
    return percentage >= 0 ? "trending_up" : "trending_down";
  }

  getGrowthClass(percentage: number): string {
    return percentage >= 0 ? "positive-growth" : "negative-growth";
  }

  gotoOrderPage() {
    this._router.navigate(["/orders"]).then();
  }

  gotoEmployeePage() {
    this._router.navigate(["/employee-list"]).then();
  }

  gotoClientPage() {
    this._router.navigate(["/client-list"]).then();
  }

  gotoItemPage() {
    this._router.navigate(["/item-list"]).then();
  }
}
