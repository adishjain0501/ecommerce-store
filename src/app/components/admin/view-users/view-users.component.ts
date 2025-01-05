import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User, UsersResponse } from '../../../models/user.model';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UserViewComponent } from '../../common/user-view/user-view.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IInfiniteScrollEvent, InfiniteScrollDirective } from 'ngx-infinite-scroll';


@Component({
  selector: 'app-view-users',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,UserViewComponent,InfiniteScrollDirective],
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.scss'
})
export class ViewUsersComponent implements OnInit{

  usersResponse?: UsersResponse;
  user?:User;
  pageNumber:number = 0;
  loading = false;
  constructor(private userService:UserService,private modalService:NgbModal){

  }
  ngOnInit(): void {
      this.loadPaginatedUsers(0);
  }

  private loadPaginatedUsers(pageNumber=0,pageSize=7,sortBy='name',sortDir='asc') {
    this.loading = true;
    this.userService.getUsers(pageNumber,pageSize,sortBy,sortDir).subscribe({
      next: (userResponse: UsersResponse) => {
        if(userResponse.pageNumber > 0){
            this.usersResponse = {
              ...userResponse,
              content:[...this.usersResponse!.content,...userResponse.content]
            }
            console.log(this.usersResponse);
        }
        else{
          this.usersResponse = userResponse;
          console.log("users=> ", this.usersResponse);
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      }
    });
  }

  openUserModal(content: any,user: User) {
    console.log("in ViewUsersComponent openUserModal=>",user);
    this.user = user;
    this.modalService.open(content,{size:'lg'});
  }

  onScroll(event:IInfiniteScrollEvent){
      console.log("scrolling logged",event);
      if(this.loading || this.usersResponse?.lastPage){
          return;
      }
      // load the data of other pages
      this.pageNumber += 1; 
      this.loadPaginatedUsers(this.pageNumber);
  }
    
}
