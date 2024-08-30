import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { removeLoginData } from '../../../store/auth/auth.actions';
import { IconsModule } from '../../../helper/icons/icons.module';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet,RouterLink,NgFor,RouterLinkActive,IconsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  constructor(private store:Store,private router:Router){}
  adminMenus = [
    {
      title:'Home',
      link:'/admin/home',
      icon:'home-check',
      cssClass:''
    },
    {
      title:'Add Product',
      link:'/admin/add-product',
      icon:'circle-plus',
      cssClass:''
    },
    {
      title:'View Products',
      link:'/admin/view-products',
      icon:'building-store',
      cssClass:''
    },
    {
      title:'Add Category',
      link:'/admin/add-category',
      icon:'square-rounded-plus',
      cssClass:''
    },
    {
      title:'View Categories',
      link:'/admin/view-category',
      icon:'category',
      cssClass:''
    },
    {
      title:'View Users',
      link:'/admin/users',
      icon: 'users-group',
      cssClass:''
    },
    {
      title:'View Orders',
      link:'/admin/orders',
      icon:'truck-delivery',
      cssClass:''
    }
  ];

 

  // faCoffee = faCoffee;

  logout(){
    console.log('inside logout function');
    this.store.dispatch(removeLoginData());
    this.router.navigate(['/login']);
  }

}
