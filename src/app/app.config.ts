import { APP_INITIALIZER, ApplicationConfig, Injector } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideState, provideStore, Store } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducers';
import { AuthService } from './services/auth.service';
import { initializeAuthState } from './helper/auth-initializer';


console.log('app config');
export function initializeApp(authService: AuthService, store: Store): () => Promise<void> {
  return () => new Promise<void>((resolve) => {
    initializeAuthState(store, authService);
    resolve();
  });
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideToastr({ positionClass: 'toast-top-center', progressBar: true }),
    provideHttpClient(withInterceptorsFromDi(), withFetch()) //any interceptors provided in your application will automatically be used with HttpClients
    ,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService, Store],
      multi: true
    },
    provideStore(),
    provideState({name:'auth',reducer:authReducer}),
    
],
};
