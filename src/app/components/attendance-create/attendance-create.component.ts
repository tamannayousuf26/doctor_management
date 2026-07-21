import {Component, OnInit} from '@angular/core';
import {AttendanceModel} from "../../models/attendance.model";
import {Router} from "@angular/router";
import {AttendanceService} from "../../services/attendance.service";
import {Subscription} from "rxjs";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {AlertMessageService} from "../../services/alert-message.service";
import {AuthenticationService} from "../../services/authentication.service";
import {DateTimeService} from "../../services/date-time.service";

@Component({
    selector: 'app-attendance-create',
    templateUrl: './attendance-create.component.html',
    styleUrls: ['./attendance-create.component.scss']
})
export class AttendanceCreateComponent implements OnInit {

    attendanceList: AttendanceModel[] = [];
    employeeListSubscription: Subscription | undefined;
    dateTimeString: any;
    dateError: boolean = false;
    employeeList: any = [];

    constructor(private _router: Router,
                private _alertMsg: AlertMessageService,
                private _authService: AuthenticationService,
                private _dateTimeService: DateTimeService,
                private _attendanceService: AttendanceService) {
    }

    ngOnInit(): void {
        this.getEmployeeList();
    }

    addEvent(event: MatDatepickerInputEvent<Date>) {
        this.dateTimeString = this._dateTimeService.getYearMonthDayFormat(event.value);
    }

    getEmployeeList() {
        this.employeeListSubscription = this._attendanceService.getEmployeeList().subscribe((resp: any) => {
            resp.forEach((item: any) => {
                let attendance = new AttendanceModel();
                attendance.id = item.id;
                attendance.name = item.name;
                this.attendanceList.push(attendance);
            });
        });
    }

    createEmployeeList(id: number, status: number) {
        this.employeeList.push({
            id: id,
            status: status,
        });
    }

    onSubmit() {
        if (this.dateTimeString == undefined) {
            this.dateError = true;
            return;
        }
        this.attendanceList.map((item: AttendanceModel) => {
            if (item.present) {
                this.createEmployeeList(Number(item.id), 1);
            } else if (item.halfPresent) {
                this.createEmployeeList(Number(item.id), 2);
            } else if (item.leave) {
                this.createEmployeeList(Number(item.id), 3);
            } else if (item.absent) {
                this.createEmployeeList(Number(item.id), 4);
            }
        });
        const obj = {
            date: this.dateTimeString,
            employees: this.employeeList,
        };
        this._attendanceService.postAttendance(obj).subscribe((resp: any) => {
            this._alertMsg.successfulSubmissionAlert('Attendance Created Successfully');
            this._router.navigateByUrl('/attendance-list').then();
        }, (error: any) => this._authService.httpRequestErrorHandler(error));

    }

    cancel() {
        this._router.navigateByUrl('/attendance-list').then();
    }
}
