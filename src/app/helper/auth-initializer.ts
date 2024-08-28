import { AuthService } from "../services/auth.service";
import { Store } from "@ngrx/store";
import { setLoginData } from "../store/auth/auth.actions";
import { LoginResponse } from "../models/login-response.model";

export function initializeAuthState(store: Store, authService: AuthService): void {
    console.log('inside appinitializer getting from local storage');
    // checking if user already logged in that is, his information is already present in local storage when page is refreshed or user opens the app in browser for first timem
    const loginData:LoginResponse = authService.getLoginDataFromLocalStorage();
  
    if (loginData.isLoggedIn === true && loginData.jwtToken != '' && loginData.user != null) {
        console.log('login data found in local storage so dispatching action to update ngrx store')
        store.dispatch(setLoginData({...loginData}));
    }
  }