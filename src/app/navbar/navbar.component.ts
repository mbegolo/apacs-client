import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import * as $ from 'jquery';

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	//isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
	//constructor(private breakpointObserver: BreakpointObserver) {};
	constructor(private router: Router) {}

	ngOnInit() {
	}

	openNav() {
	    document.getElementById("main-nav").style.width = "20em";
	    document.getElementById("main-nav").style.opacity = "1";
	    document.getElementById('sidenav-external').style.display = "block";
	}

	closeNav() {
	    document.getElementById("main-nav").style.width = "0";
	    document.getElementById("main-nav").style.opacity = "0";
	    document.getElementById('sidenav-external').style.display = "none";
	}
}
