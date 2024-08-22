import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }

  //signup logic
  signupUser(user:User){
      return this.httpClient.post<User>(`${environment.baseUrl}/users`,user);

  }
}
