import { createReducer, on } from "@ngrx/store";
import { setCategoryData } from "./category.actions";
import { Category } from "../../models/category.model";

const initialState:Category[] = [];

export const categoryReducer = createReducer(
    initialState,
    //invoked when setLoginData action is dispatched in case of successful login and if login details are found in local storage on app initialization i.e. on page refresh
    on(setCategoryData, (state, {categories}) => {
        console.log("inside reducer for setCategoryData action");
        console.log("old state",state);
        let retVal = [ ...categories ];
        console.log("returning from reducer: ",retVal);
        return retVal;
    })
);