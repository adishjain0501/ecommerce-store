import { Routes } from '@angular/router';
import { normalUserGuard } from './components/guards/normal-user.guard';
import { adminUserGuard } from './components/guards/admin-user.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/pages/home/home.component').then(
        (mod) => mod.HomeComponent,
      ),
    title: 'Home: Electronic Store',
  },
  {
    path: 'store',
    loadComponent: () =>
      import('./components/pages/store/store.component').then(
        (mod) => mod.StoreComponent,
      ),
    title: 'All Products: Store',
  },
  {
    path: 'product/:productId',
    loadComponent: () =>
      import('./components/pages/view-product/view-product.component').then(
        (mod) => mod.ViewProductComponent,
      )
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/pages/cart/cart.component').then(
        (mod) => mod.CartComponent,
      ),
      title: 'Cart | Electronic Store',
  },
  {
    path: 'store/:categoryId/:categoryTitle',
    loadComponent: () =>
      import('./components/pages/store-categories/store-categories.component').then(
        (mod) => mod.StoreCategoriesComponent,
      )
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/pages/user-profile/user-profile.component').then(
        (mod) => mod.UserProfileComponent,
      ),
    title: 'User Profile: Electronic Store',
    canActivate: [normalUserGuard]
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/pages/about/about.component').then(
        (mod) => mod.AboutComponent,
      ),
    title: 'About: Electronic Store',
  },
  {
    path: 'features',
    loadComponent: () =>
      import('./components/pages/feature/feature.component').then(
        (mod) => mod.FeatureComponent,
      ),
    title: 'Features: Electronic Store',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/pages/login/login.component').then(
        (mod) => mod.LoginComponent,
      ),
    title: 'Login: Electronic Store',
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/pages/signup/signup.component').then(
        (mod) => mod.SignupComponent,
      ),
    title: 'SignUp: Electronic Store',
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./components/common/categories/categories.component').then(
        (mod) => mod.CategoriesComponent,
      ),
    title: 'Categories: Electronic Store',
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./components/user/dashboard/dashboard.component').then(
        (mod) => mod.DashboardComponent,
      ),
    title: 'User Dashboard',
    canActivate: [normalUserGuard]
  },
  {
    path: 'my/orders',
    loadComponent: () =>
      import('./components/pages/my-orders/my-orders.component').then(
        (mod) =>  mod.MyOrdersComponent
      ),
      title: 'My Orders',
      canActivate: [normalUserGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin-dashboard/admin-dashboard.component').then(
        (mod) => mod.AdminDashboardComponent,
      ),
    title: 'Admin Dashboard',
    canActivate: [adminUserGuard],
    children:[
      {
        path: 'home',
        loadComponent: () =>
          import('./components/admin/home/home.component').then(
            ({ HomeComponent: AdminHomeComponent }) =>  AdminHomeComponent,
          ),
          title: 'Admin Dashboard'
      },
      {
        path: 'add-product',
        loadComponent: () =>
          import('./components/admin/add-product/add-product.component').then(
            (mod) =>  mod.AddProductComponent,
          ),
          title: 'Add Product'
      },
      {
        path: 'view-products',
        loadComponent: () =>
          import('./components/admin/view-products/view-products.component').then(
            (mod) =>  mod.ViewProductsComponent
          ),
          title: 'View Products' 
      },
      {
        path: 'add-category',
        loadComponent: () =>
          import('./components/admin/add-categories/add-categories.component').then(
            (mod) =>  mod.AddCategoriesComponent
          ),
          title: 'Add Category' 
      },
      {
        path: 'view-category',
        loadComponent: () =>
          import('./components/admin/view-categories/view-categories.component').then(
            (mod) =>  mod.ViewCategoriesComponent
          ),
          title: 'View Category' 
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('./components/common/feedback/feedback.component').then(
            (mod) =>  mod.FeedbackComponent
          ),
          title: 'Feedback' 
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/admin/view-orders/view-orders.component').then(
            (mod) =>  mod.ViewOrdersComponent
          ),
        title: 'View Orders'
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/admin/view-users/view-users.component').then(
            (mod) =>  mod.ViewUsersComponent
          ),
          title: 'All Users'
      },
     
      {
        path: '',
        redirectTo: 'home', // slash indicates absolute path starting from the root
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home', // slash indicates absolute path starting from the root
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'home' },
];
