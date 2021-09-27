/* eslint-disable @typescript-eslint/no-unused-vars */
/*
  Copyright 2019 Chevron. All Rights Reserved.
*/

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class ErrorService {
  constructor(private router: Router) {}

  showErrorPage(errorCode: any) {
    this.router.navigate([
      "/",
      {
        outlets: {
          error: ["error", errorCode],
        },
      },
    ]);
  }

  showBadRequest() {
    this.showErrorPage(400);
  }

  showUnauthorized() {
    this.showErrorPage(401);
  }

  showNotFound() {
    this.showErrorPage(404);
  }

  showForbidden() {
    this.showErrorPage(403);
  }

  showServiceUnavailable() {
    this.showErrorPage(503);
  }

  showServerError() {
    this.showErrorPage(500);
  }

  getClientErrorMessage(error: Error): string {
    return "An unexpected error has occurred. Please try again later.";
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    return navigator.onLine
      ? "An unexpected error has occurred. Please try again later."
      : "No Internet Connection";
  }
}
