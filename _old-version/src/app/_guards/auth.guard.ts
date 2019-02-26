import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            console.log("Exam found");
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        console.log("Exam NOT found");
        return false;
    }
}