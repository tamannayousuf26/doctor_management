import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../utility/apiConfig';

export interface DashboardOverview {
    total_orders_created: number;
    total_orders_delivered: number;
    total_orders_pending: number;
    total_order_value: number;
    total_paid: number;
    total_due: number;
    average_order_value: number;
}

export interface MonthlyBreakdown {
    month: string;
    month_number: number;
    orders_created: number;
    orders_delivered: number;
    order_value: number;
    paid_amount: number;
    due_amount: number;
}

export interface PaymentDistribution {
    paid: {
        count: number;
        value: number;
    };
    unpaid: {
        count: number;
        value: number;
    };
    collection_rate: number;
}

export interface TopClient {
    client_id: number;
    client_name: string;
    doctor_name: string;
    order_count: number;
    total_value: number;
    paid_value?: number;
    due_value?: number;
}

export interface TopClients {
    by_value: TopClient[];
    by_count: TopClient[];
}

export interface YearComparison {
    previous_year: number;
    previous_year_orders: number;
    previous_year_value: number;
    order_growth_percentage: number;
    revenue_growth_percentage: number;
}

export interface ClientInfo {
    id: number;
    name: string;
    doctor_name: string;
    phone: string;
    address: string;
}

export interface DashboardData {
    year: number;
    client_id: number | null;
    overview: DashboardOverview;
    monthly_breakdown: MonthlyBreakdown[];
    payment_distribution: PaymentDistribution;
    top_clients?: TopClients;
    comparison_with_previous_year: YearComparison;
    client_info?: ClientInfo;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private http: HttpClient) { }

    getYearWideDashboard(year: number): Observable<DashboardData> {
        return this.http.get<DashboardData>(`${ApiConfig.baseUrl}dashboard/${year}`);
    }

    getClientDashboard(year: number, clientId: number): Observable<DashboardData> {
        return this.http.get<DashboardData>(`${ApiConfig.baseUrl}dashboard/${year}/client/${clientId}`);
    }

    getActiveClients(): Observable<any[]> {
        return this.http.get<any[]>(ApiConfig.baseUrl + ApiConfig.getActiveClientList);
    }
}
