import { SideNavNode } from "./helper";

export const TREE_DATA: SideNavNode[] = [
  {
    name: "Dashboard",
    icon: "home",
    routerLink: "/home",
  },
  {
    name: "Employee",
    icon: "manage_accounts",
    routerLink: "/",
    children: [
      { name: "Attendance", icon: "checklist", routerLink: "/attendance-list" },
      // {name: 'Employee Create', icon: 'person_add', routerLink: '/employee-create'},
      { name: "Employee List", icon: "groups", routerLink: "/employee-list" },
    ],
  },
  // {
  //   name: "Client",
  //   icon: "person_add",
  //   routerLink: "/",
  //   children: [
  //     // {name: 'Client Create', icon: 'group_add', routerLink: '/client-create'},
  //     { name: "Client List", icon: "diversity_3", routerLink: "/client-list" },
  //   ],
  // },
  { name: "Client List", icon: "diversity_3", routerLink: "/client-list" },
  { name: "Item List", icon: "auto_stories", routerLink: "/item-list" },
  // {
  //   name: "Item",
  //   icon: "article",
  //   routerLink: "/",
  //   children: [
  //     //{name: 'Item Create', icon: 'post_add', routerLink: '/item-create'},
  //     { name: "Item List", icon: "auto_stories", routerLink: "/item-list" },
  //   ],
  // },
  {
    name: "Cash Sale",
    icon: "point_of_sale",
    routerLink: "/cash-sale",
  },
  {
    name: "Instant Invoice",
    icon: "receipt_long",
    routerLink: "/instant-invoice",
  },
  {
    name: "Accounts",
    icon: "paid",
    routerLink: "/",
    children: [
      {
        name: "Sale Invoice",
        icon: "receipt",
        routerLink: "/sale-invoice",
      },
      // {
      //   name: "Asset List",
      //   icon: "format_list_numbered",
      //   routerLink: "/asset-list",
      // },
      // { name: "Income List", icon: "sort", routerLink: "/income/list" },
      // {
      //   name: "Purchase List",
      //   icon: "shopping_bag",
      //   routerLink: "/purchase/list",
      // },
      // { name: "Expense List", icon: "local_atm", routerLink: "/expense/list" },
      // { name: "Peticash List", icon: "receipt", routerLink: "/peticash/list" },
    ],
  },
  {
    name: "Order",
    icon: "shopping_cart",
    routerLink: "/",
    children: [
      { name: "Order List", icon: "receipt_long", routerLink: "/orders" },
      {
        name: "Order Delivered",
        icon: "local_shipping",
        routerLink: "/today/delivered",
      },
      // {
      //   name: "Order Create",
      //   icon: "add_shopping_cart",
      //   routerLink: "/orders/create",
      // },
    ],
  },
  {
    name: "Reports",
    icon: "assignment",
    routerLink: "/",
    children: [
      {
        name: "Work Status Summary",
        icon: "equalizer",
        routerLink: "/summary/work-status",
      },
      {
        name: "All Clinic Work Status Summary",
        routerLink: "/summary/all-clinic-work-status",
        icon: "medical_services",
      },
      { name: "Work Summary", routerLink: "/summary/work", icon: "pie_chart" },
      {
        name: "All Work Status Summary",
        routerLink: "/summary/all-work-status",
        icon: "table_chart",
      },
      {
        name: "All Delivered Work Status Summary",
        routerLink: "/summary/all-delivered-work-status",
        icon: "incomplete_circle",
      },
      {
        name: "All Redo Work Summary",
        routerLink: "/summary/all-redo-work-summary",
        icon: "incomplete_circle",
      },
    ],
  },
  // {
  //   name: "Today Order",
  //   icon: "today",
  //   routerLink: "/",
  //   children: [
  //     {
  //       name: "Order Received",
  //       icon: "local_mall",
  //       routerLink: "/today/received",
  //     },
  //   ],
  // },
];
