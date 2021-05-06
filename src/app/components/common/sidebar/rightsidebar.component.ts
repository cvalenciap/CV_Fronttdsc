import { Component, Input, AfterViewInit } from '@angular/core';
declare var jQuery:any;

@Component({
  selector: 'right-sidebar',
  templateUrl: 'rightsidebar.template.html'
})
export class RightSidebarComponent implements AfterViewInit {

  @Input('title')
  title: string;

  @Input('description')
  description: string;

  @Input('icon')
  icon: string;

  ngAfterViewInit() {
    // Open close right sidebar
    jQuery('.right-sidebar-toggle').click(function () {
      jQuery('#right-sidebar').toggleClass('sidebar-open');
    });
  }

}
