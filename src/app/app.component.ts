import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {TREE_DATA} from "./sidenav/nav-data";

interface SideNavToggle {
    screenWidth: number;
    collapsed: boolean;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Vivadent';
    isSideNavCollapsed = false;
    screenWidth = 0;
    isLoginPage = false;
    isLandingPage = false;

    onToggleSideNav(data: SideNavToggle): void {
        this.screenWidth = data.screenWidth;
        this.isSideNavCollapsed = data.collapsed;
    }

    ngOnInit(): void {
        let url: string = window.location.href;
        const array = url.split("/");
        const lastElement = array.pop();
        if (lastElement == 'welcome' || lastElement == '')
            this.isLandingPage = true;
        if (lastElement == 'login')
            this.isLoginPage = true;


    }

}
