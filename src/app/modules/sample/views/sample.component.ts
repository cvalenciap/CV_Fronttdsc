import { Component, OnDestroy, OnInit, } from '@angular/core';

@Component({
  selector: 'sample',
  templateUrl: 'sample.template.html'
})
export class SampleComponent implements OnDestroy, OnInit  {

public nav:any;
public text:string;

public constructor() {
  this.nav = document.querySelector('nav.navbar');
  this.text = "This is the Sample component.";
}

public ngOnInit():any {
  this.nav.className += " white-bg";
}


public ngOnDestroy():any {
  this.nav.classList.remove("white-bg");
}

}
