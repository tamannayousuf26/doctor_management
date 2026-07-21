export interface SideNavNode {
    name: string;
    children?: SideNavNode[];
    icon: string;
    routerLink: string;
}
export interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
    icon: string;
    routerLink: string;
}
