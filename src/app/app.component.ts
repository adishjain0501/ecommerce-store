import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomNavbarComponent } from './components/common/custom-navbar/custom-navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showAdditionalInfo = false;

  constructor(private toastr: ToastrService) {
    // const x = signal<number>(5);
    // console.log("x="+x());
    // const y = signal(3);
    // console.log("y="+y());
    // const z = computed(()=>{
    //   return x() + y()
    // });
    // console.log("z="+z());
    // x.set(10);
    // console.log("x="+x());
    // console.log("z="+z());
    // let arr = [12,23,34,45];
    // let n = arr.with(2,24);
    // console.log(arr);
    // console.log(n)
  }
  title = 'ecommerce-web-app';

  showInfo() {
    this.showAdditionalInfo = true;
    setTimeout(() => {
      this.showAdditionalInfo = false;
      console.log('Reset happened');
    }, 3000);
  }

  showToastr() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
