import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataService } from '../_services';

@Injectable()
export class ExamGuard implements CanActivate {

    constructor(private router: Router, private dataService:DataService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        /*
        alert(this.dataService.getSelectedExam());
        if ( this.dataService.getSelectedExam() != null ) {
            // logged in so return true
            return true;
        }

        this.router.navigate(['/home'], { queryParams: { returnUrl: state.url }});
        return false;
        */
        return true;
    }
}