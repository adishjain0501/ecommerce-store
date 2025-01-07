import { createReducer, on } from "@ngrx/store";
import { Cart } from "../../models/cart.model";
import { removeCart, updateCart } from "./cart.actions";
import { User } from "../../models/user.model";


const initialCart:Cart = getBlankCart();

export const cartReducer = createReducer(
    initialCart,
    //invoked when setLoginData action is dispatched in case of successful login and if login details are found in local storage on app initialization i.e. on page refresh
    on(updateCart, (state,{cart}) => {
        console.log("inside reducer for updateCart action -> updating cart in store");
        console.log("old state",state);
        return {...cart};
    }),
    on(removeCart, (state) => {
        return getBlankCart();
    })
);

function getBlankCart(){
    return  {
        cartId:'',
        createdAt: new Date(),
        items:[],
        user: new User('','','', '','', '', [], '')
    }
}