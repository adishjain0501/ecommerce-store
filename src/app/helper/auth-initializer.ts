import { AuthService } from "../services/auth.service";
import { Store } from "@ngrx/store";
import { setLoginData } from "../store/auth/auth.actions";

export function initializeAuthState(store: Store, authService: AuthService): void {
    console.log('inside appinitializer getting from local storage');
    // checking if user already logged in that is, his sinformation is already present in local storage
    const loginData = authService.getLoginDataFromLocalStorage();
  
    if (loginData) {
        console.log('login data found in local storage so dispatching action to update ngrx store')
        store.dispatch(setLoginData({...loginData}));
    }
  }