import { Component, OnInit } from '@angular/core';
import { AppdataService } from "./../../core/services/appdata.service";
import { Comp } from "../../core/interfaces/comp"
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  restData :Comp[] = [];
  constructor(public appdataService: AppdataService) { }

  ngOnInit(): void {
    this.initRestData();
  }
  initRestData(){
    this.appdataService.getRestData().subscribe((response) =>{
      this.restData = response as Comp[];
    })
  }

}
