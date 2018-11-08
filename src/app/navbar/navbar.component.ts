import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { User } from '../_models';
import { UserService } from '../_services';
import { Exam } from '../_models';
import { ExamService } from '../_services';


import * as $ from 'jquery';

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	currentUser: User;
	currentExam: Exam;
	selected = false;

    constructor(private userService: UserService, private examService: ExamService) { }

	ngOnInit() {
		this.currentExam = new Exam();
		this.currentExam.selected = false;
		this.currentExam = JSON.parse(localStorage.getItem('currentExam'));
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		var localUsrData = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser.id = localUsrData["user"]["_id"];
    this.currentUser.username = localUsrData["user"]["username"];
    this.currentUser.email = localUsrData["user"]["email"];
    this.currentUser.token = localUsrData["jwt"];
	}

	loadCurrentExam() {
		this.examService.getExamById(this.currentExam.id);
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
