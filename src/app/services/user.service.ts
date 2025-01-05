import { Injectable } from '@angular/core';
import { User, UsersResponse } from '../models/user.model';
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

  getUserImageUrl(userId:string){
      return `${environment.baseUrl}/users/image/${userId}?${new Date().getTime()}`;
  }

  // GET ALL USERS
  getUsers(pageNumber=0,pageSize=10,sortBy='name',sortDir='asc'){
      return this.httpClient.get<UsersResponse>(`${environment.baseUrl}/users?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  // get single user
  getUser(userId:string){
      return this.httpClient.get(`${environment.baseUrl}/users/${userId}`);
  }

  // update user
  updateUser(user:User){
      return this.httpClient.put<User>(`${environment.baseUrl}/users/${user.userId}`,user);
  }

  //delete user
  deleteUser(userId:string){
      return this.httpClient.delete(`${environment.baseUrl}/users/${userId}`);
  }

  //get user by emailid
  getUserByEmailId(emailId:string){
    return this.httpClient.get(`${environment.baseUrl}/users/email/${emailId}`);
  }

  // upload userImage
  uploadUserImage(userId:string,userImage:File){
      let formData = new FormData();
      formData.append('userImage',userImage);
      return this.httpClient.post(`${environment.baseUrl}/users/image/${userId}`,formData);
  }

  // search user
  searchUser(query:string){
      return this.httpClient.get(`${environment.baseUrl}/users/search/${query}`);
  }
}
