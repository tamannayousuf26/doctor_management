import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FeatherModule} from 'angular-feather';
import {allIcons} from 'angular-feather/icons';
import {FormsModule} from '@angular/forms'
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DemoFlexyModule} from './demo-flexy-module'
// Modules
import {DashboardModule} from './dashboard/dashboard.module';
import {ComponentsModule} from './components/components.module';
import {BodyComponent} from './body/body.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {MatTreeModule} from "@angular/material/tree";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptorService} from "./services/auth-interceptor.service";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        AppComponent,
        BodyComponent,
        SidenavComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FeatherModule.pick(allIcons),
        DemoFlexyModule,
        DashboardModule,
        ComponentsModule,
        FormsModule,
        MatTreeModule,
        NgbModule
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true,},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
