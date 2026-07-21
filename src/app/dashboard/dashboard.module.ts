import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DemoFlexyModule} from '../demo-flexy-module'
import {DashboardComponent} from './dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgApexchartsModule} from 'ng-apexcharts';

@NgModule({
    declarations: [
        DashboardComponent,
    ],
    imports: [
        CommonModule,
        DemoFlexyModule,
        FormsModule,
        ReactiveFormsModule,
        NgApexchartsModule,
    ],
    exports: [
        DashboardComponent,
    ]
})
export class DashboardModule {
}
