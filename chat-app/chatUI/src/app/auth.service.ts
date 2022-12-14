import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { head } from "lodash";

const localAuthUrl = environment.API_URL + `auth/login`;
const tokenUrl = environment.API_URL + 'auth/token';
const googleAuthUrl = environment.API_URL + `auth/google`;

@Injectable({
    providedIn:'root',
})
export class AuthService{
    constructor(private readonly http:HttpClient){

    }

    createAuthorizationHeader(headers: HttpHeaders, token:string){
        headers.append('Authorizaition',`Bearer ${token}`);
    }

    login(username:string, password: string){
        return this.http.post<{code: string}>(localAuthUrl, {
            username: username,
            password: password,
            client_id: 'test_client_id',
            client_secret: 'test_client_secret',
        });
    }

    getToken(code: string){
        return this.http.post<{accessToken:string, refreshToken:string,expires:Number}>(tokenUrl,{
            code:code,
            clientId:"test_client_id"
        })
    }

    oAuthLogin(url:string){
        const myform = document.createElement('form');
        const body = {
            client_id: 'test_client_id',
            client_secret:'test_client_secret'
        };
        myform.method = 'POST';
        myform.action = url;
        myform.style.display = 'none';
        myform.append('Content-Type', 'application/x-www-form-urlencoded');
        Object.keys(body).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;

            input.value = (body as any)[key];
            myform.appendChild(input);
        });
        document.body.appendChild(myform);
        myform.submit();
    }

    loginViaGoogle(){
        this.oAuthLogin(googleAuthUrl);
    }

}