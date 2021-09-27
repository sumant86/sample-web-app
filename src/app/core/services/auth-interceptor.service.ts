/*
  Copyright 2019 Chevron. All Rights Reserved.
*/

import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { from, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { TokenService } from "../services/token.service";
import * as moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorService } from "./error.service";

@Injectable({ providedIn: "root" })
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    public tokenService: TokenService,
    private snackBar: MatSnackBar,
    private errorService: ErrorService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      request.url.includes(".auth/me") ||
      request.url.includes(".auth/refresh") ||
      request.url.includes("auth.json")
    ) {
      return next.handle(request);
    }
    return from(this.addAuthHeader(request, next));
  }

  async addAuthHeader(request: HttpRequest<any>, next: HttpHandler) {
    const tokens = await this.tokenService.getTokens();
    if (!tokens) {
      return next.handle(request).toPromise();
    }

    const req = request.clone({
      headers: request.headers.set(
        "Authorization",
        `Bearer ${tokens['access_token']}`
      ),
    });

    const encodedReq = this.encodeUrl(req);

    if (this.isAfter(tokens['expires_on'])) {
      return this.refreshTokens(encodedReq, next);
    }

    return next
      .handle(encodedReq)
      .pipe(
        tap((res: any) => {
          if (res.status === 204) {
            const errorMessage = res.message
              ? res.message
              : "Error Code: 204 | Not Found";
            this.snackBar.open(errorMessage, "Close", {
              panelClass: "warning",
            });
          }
        }),
        catchError(async (error: HttpErrorResponse) => {
          const errorMessage = error.error
            ? error.error.message
            : error.message;
          if (error.status === 401) {
            return this.refreshTokens(encodedReq, next);
          }

          if (error.status === 403) {
            this.errorService.showForbidden();
            return false;
          } else {
            this.snackBar.open(errorMessage, "Close", {
              panelClass: "error",
            });
          }

          return throwError(error).toPromise();
        })
      )
      .toPromise();
  }

  async refreshTokens(req: HttpRequest<any>, next: HttpHandler) {
    const refreshedTokens = await this.tokenService.refreshTokens();

    const refreshedRequest = req.clone({
      headers: req.headers.set(
        "Authorization",
        `Bearer ${refreshedTokens['access_token']}`
      ),
    });

    return next
      .handle(refreshedRequest)
      .pipe(catchError((err: HttpErrorResponse) => throwError(err).toPromise()))
      .toPromise();
  }

  isAfter(date: string, today = moment()) {
    const expiration = moment(date);
    return today.isAfter(expiration);
  }

  encodeUrl(req: HttpRequest<any>): HttpRequest<any> {
    const encodedUrl = req.urlWithParams.replace(/\+/g, "%2B");
    return Object.assign(req, { urlWithParams: encodedUrl });
  }
}
