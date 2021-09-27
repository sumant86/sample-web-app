import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from './../../../environments/environment';
// import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class TokenService {
    private API_ROOT_AUTH: string = environment.API_ROOT_AUTH;
	private API_AUTH_REFRESH: string =  environment.API_AUTH_REFRESH;
	private local: boolean = environment.local;

	private authtoken$: BehaviorSubject<any> = new BehaviorSubject(null);
    public _authtoken: Observable<any> = this.authtoken$.asObservable();

    token: any;
//   token$ = new Subject<any>();
  userClaims: any;
	constructor(private _http: HttpClient) {}
    set authtoken(auth: any) {
		this.authtoken$.next(auth as any);
    }
    get authtoken():any {
        return this._authtoken as any;
    }
    setauthtoken(auth: any){
        this.authtoken = auth as any;
    }
    async getTokens() {
        if (!this.token) {
        const url: string = this.local
			? '../../assets/data/auth.json'
			: this.API_ROOT_AUTH;
          const resp = await this._http
            .get<any[]>(url)
            .toPromise();
          this.token = resp[0];
          this.setauthtoken(this.token);
        }
        return this.token;
      }
    
      async refreshTokens() {
        this.token = null;
        await this._http
          .get(this.API_AUTH_REFRESH, {
            responseType: "text",
            observe: "response",
          })
          .toPromise();
    
        return this.getTokens();
      }

     
}
