import { Routes } from '@angular/router';
import { normalUserGuard } from './components/guards/normal-user.guard';

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
    path: '',
    redirectTo: '/home', // slash indicates absolute path starting from the root
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'home' },
];
