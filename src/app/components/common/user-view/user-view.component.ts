import { Component, Input } from '@angular/core';
import { User } from '../../../models/user.model';
import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [NgIf,NgFor,UpperCasePipe,NgClass],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss'
})
export class UserViewComponent {
    @Input() user?: User|null;
    imgUrl!: string;

    constructor(public userService:UserService){
        
    }

    

}
