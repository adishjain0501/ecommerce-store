import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LoginResponse } from "../../models/login-response.model";

export const selectAuthState = createFeatureSelector<LoginResponse>('auth');

export const selectIsLoggedIn = createSelector(
    selectAuthState,
    (state: LoginResponse) => state.isLoggedIn
  );
  
  export const selectJwtToken = createSelector(
    selectAuthState,
    (state: LoginResponse) => state.jwtToken
  );
  
  export const selectUser = createSelector(
    selectAuthState,
    (state: LoginResponse) => state.user
  );

  export const selectAuthDetails = createSelector(
    selectAuthState,
    (state: LoginResponse) => ({
      jwtToken: state.jwtToken,
      isLoggedIn: state.isLoggedIn,
      user: state.user
    })
  );