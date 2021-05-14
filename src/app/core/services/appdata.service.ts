import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { finalize, tap } from "rxjs/operators";

import { ApiService } from "./api.service";
import { AppError } from "./../interfaces/app-error";
import { API_ROUTES } from "../../../config/api-routes.constants";
import { Comp } from "../interfaces/comp"

@Injectable({
  providedIn: 'root'
})
export class AppdataService {

  constructor(private apiService: ApiService) { }

  getRestData(): Observable<Comp | AppError> {
    return this.apiService
      .get<Comp>(
        API_ROUTES().Module_Name.component_name()
      );
  }

}

