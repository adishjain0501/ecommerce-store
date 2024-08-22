import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {LoginResponse} from '../models/login-response.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient) { }

  generateToken(loginData:{email:string,password:string}){
      return this.httpClient.post<LoginResponse>(`${environment.baseUrl}/auth/login`,loginData);
  }
}
