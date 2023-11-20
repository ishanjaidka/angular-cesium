import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  data: any;
  options: any = {
    404: {
      url: 'assets/errors/page-not-found.svg',
      title: 'Sorry, this page cannot be found.',
      description: 'The page you\'ve requested does not exist. '
    },
    500: {
      url: 'assets/errors/server-error.svg',
      title: 'Sorry, something went wrong.',
      description: 'Please bear with us and try again.'
    }
  };

  constructor(private router: Router, private route: ActivatedRoute, private titleService: Title) { }

  ngOnInit(): void {
    this.data = this.options[this.route.snapshot.data['code']];
    this.titleService.setTitle(this.data.title);
  }

}
