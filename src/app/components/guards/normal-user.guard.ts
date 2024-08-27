import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import {  map } from 'rxjs';

export const normalUserGuard: CanActivateFn = (route, state) => {
  console.log('normal user guard');
  const authService = inject(AuthService);
  const router = inject(Router);    
  const retVal = authService.checkLoginAndNormalUser().pipe(map(value=>{
      if(value){
        return true;
      }
      else{
          authService.showWarning('You are not logged in');
        // setTimeout(()=>{
          router.navigate(['/login']);
        // },3000);
        return false;
      }
  }));
  console.log(retVal);
  return retVal;  
}
