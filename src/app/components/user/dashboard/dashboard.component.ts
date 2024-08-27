import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginResponse } from '../../../models/login-response.model';
import { Router } from '@angular/router';
import { selectAuthDetails, selectIsLoggedIn, selectJwtToken, selectUser } from '../../../store/auth/auth.selectors';
import { map, Observable, tap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf,AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
  
  user$!:Observable<User|null>;
  constructor(private store:Store<{auth:LoginResponse}>,private router:Router){}

  ngOnInit(){
    
    
    this.user$ = this.store.select(selectUser);
  }

  

}
