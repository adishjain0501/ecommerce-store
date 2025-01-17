import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideState, provideStore, Store } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducers';
import { AuthService } from './services/auth.service';
import { initializeAuthState } from './helper/auth-initializer';
import { GlobalErrorHandler } from './error-handler/global-error-handler';
import { JwtInterceptor } from './services/jwt-interceptor';
import { categoryReducer } from './store/category/category.reducers';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { cartReducer } from './store/cart/cart.reducers';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';


console.log('app config');
export function initializeApp(authService: AuthService, store: Store): () => Promise<void> {
  return () => new Promise<void>((resolve) => {
    initializeAuthState(store, authService);
    resolve();
  });
}

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsOpacity: 0.8,
  bgsSize: 60,
  bgsType: 'ball-spin-clockwise', // Background spinner type
  fgsType: 'chasing-dots',       // Foreground spinner type
  fgsColor: '#ffffff',
  overlayColor: 'rgba(40,40,40,0.8)',
  hasProgressBar: true,
  pbColor: 'blue',
  pbThickness: 10,
  pbDirection:"ltr",
  bgsPosition:"center-center",
  text: 'Loading...',
  blur: 10
}; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideToastr({ positionClass: 'toast-top-right', progressBar: true }),
    importProvidersFrom(SweetAlert2Module.forRoot()),
    provideHttpClient(withInterceptorsFromDi(), withFetch()), //any interceptors provided in your application will automatically be used with HttpClients
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService, Store],
      multi: true
    },
    provideStore(),
    provideState({
      name:'auth',reducer:authReducer
    }),
    provideState({ name: 'cat', reducer: categoryReducer }),
    provideState({ name: 'cart', reducer: cartReducer }),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false, // Automatically sign in if user is already logged in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('250095467226-i8ca9l3na9qtb54rbm1dl02mfkr3l6a2.apps.googleusercontent.com'),
          }
        ]
      } as SocialAuthServiceConfig,
    },
    provideCharts(withDefaultRegisterables()), // Registers default Chart.js components globally
    importProvidersFrom(NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    // Import NgxUiLoaderHttpModule with optional configuration
    NgxUiLoaderHttpModule.forRoot({
      // showForeground: true, // Shows the foreground loader for HTTP requests
      exclude: ['/assets/', '/api/health-check'], // Exclude specific URLs from showing the loader
    }),NgxUiLoaderRouterModule.forRoot({
      showForeground:true,
      
    }))
  ]
};


