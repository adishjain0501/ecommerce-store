import {createAction, props} from '@ngrx/store';
import { LoginResponse } from '../../models/login-response.model';

export const setLoginData = createAction(
    "SET_LOGIN_DATA",
    props<LoginResponse>()
);



export const removeLoginData = createAction(
    "REMOVE_LOGIN_DATA"
);

// if needed more actions can be created

