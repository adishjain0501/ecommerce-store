import { createReducer,on } from "@ngrx/store";
import { LoginResponse } from "../../models/login-response.model";
import { removeLoginData, setLoginData } from "./auth.actions";



export const initialState:LoginResponse = {
    jwtToken: '',
    isLoggedIn: false,
    user: null,
  };

// {
//     jwtToken: '',
//     user: null,
//     isLoggedIn: false
// };

export const authReducer = createReducer(
    initialState,
    //invoked when setLoginData action is dispatched in case of successful login and if login details are found in local storage on app initialization i.e. on page refresh
    on(setLoginData, (oldState, {jwtToken,user}) => {
        console.log("inside reducer for setLoginData action");
        console.log("old state",oldState);
        let retVal = { ...oldState,jwtToken, user, isLoggedIn: true };
        console.log("returning from reducer: ",retVal);
        return retVal;
    }),
    on(removeLoginData, () => {
        console.log("inside reducer for removeLoginData action");
        return {
            jwtToken: '',
            user: null,
            isLoggedIn: false
        }
    })
);