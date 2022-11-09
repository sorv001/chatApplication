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
            code:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6InRlc3RfY2xpZW50X2lkIiwidXNlciI6eyJkZWxldGVkIjpmYWxzZSwiZGVsZXRlZE9uIjpudWxsLCJkZWxldGVkQnkiOm51bGwsImNyZWF0ZWRPbiI6IjIwMjItMTEtMDlUMDU6MDI6NDIuNTc1WiIsIm1vZGlmaWVkT24iOiIyMDIyLTExLTA5VDA2OjA1OjQ5Ljg2OFoiLCJjcmVhdGVkQnkiOm51bGwsIm1vZGlmaWVkQnkiOiI0MzMxNWYxZi05ZjVlLTM4MGUtNmY2ZS0wYWUwYmE0MmE5OGMiLCJpZCI6IjQzMzE1ZjFmLTlmNWUtMzgwZS02ZjZlLTBhZTBiYTQyYTk4YyIsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJVc2VyIiwibWlkZGxlTmFtZSI6bnVsbCwidXNlcm5hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJwaG9uZSI6bnVsbCwiYXV0aENsaWVudElkcyI6WzFdLCJsYXN0TG9naW4iOiIyMDIyLTExLTA5VDA2OjA1OjQ5Ljg2N1oiLCJkb2IiOm51bGwsImdlbmRlciI6bnVsbCwiZGVmYXVsdFRlbmFudElkIjoiMGRkZmE3ZjEtNTQ5Zi0yYjcxLWNiNDktOTQ4YWE4NzEyNmQwIiwicGVybWlzc2lvbnMiOltdfSwiaWF0IjoxNjY3OTkwMjM4LCJleHAiOjE2Njc5OTA0MTgsImF1ZCI6InRlc3RfY2xpZW50X2lkIiwiaXNzIjoic2F1cmFiaCJ9.7EQWq2YDMU9KadzNmdpktJ33S7fcgSfT5mSwvytENYU",
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