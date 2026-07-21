import {Component, Output, EventEmitter, OnInit, HostListener} from '@angular/core';
import {TREE_DATA} from "./nav-data";
import {SideNavNode, ExampleFlatNode} from './helper';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";

interface SideNavToggle {
    screenWidth: number;
    collapsed: boolean;
}

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
    @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
    screenWidth = 0;
    collapsed = false;
    currentUser: any;

    constructor(private _authService: AuthenticationService,
                private _storage: StorageService,
                private _router: Router) {
        this.dataSource.data = TREE_DATA;
    }

    ngOnInit(): void {
        this.screenWidth = window.innerWidth;
        this.currentUser = JSON.parse(this._storage.getStorage('user_info'));
    }

    logout() {
        this._authService.logout();
    }

    toggleCollapse(): void {
        this.collapsed = !this.collapsed;
        this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }

    closeSidenav(): void {
        this.collapsed = false;
        this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }

    onClickSettings() {
        this._router.navigateByUrl('/profile').then(() => console.log(""));
    }

    private _transformer = (node: SideNavNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level: level,
            icon: node.icon,
            routerLink: node.routerLink
        };
    };

    treeControl = new FlatTreeControl<ExampleFlatNode>(
        node => node.level,
        node => node.expandable,
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => node.children,
    );
    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.screenWidth = window.innerWidth;
        if (this.screenWidth <= 768) {
            this.collapsed = false;
            this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
        }
    }

}
