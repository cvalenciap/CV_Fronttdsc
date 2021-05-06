import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {BsDropdownModule} from 'ngx-bootstrap';
import {BasicLayoutComponent} from './basicLayout.component';
import {BlankLayoutComponent} from './blankLayout.component';
import {NavigationComponent} from './../navigation/navigation.component';
import {FooterComponent} from './../footer/footer.component';
import {TopNavbarComponent} from './../topnavbar/topnavbar.component';
import {TopNavigationNavbarComponent} from './../topnavbar/topnavigationnavbar.component';
import {RightSidebarComponent} from './../sidebar/rightsidebar.component';
import {MensajeSistemaComponent} from './../mensaje-sistema/mensaje-sistema.component';


@NgModule({
  declarations: [
    FooterComponent,
    BasicLayoutComponent,
    BlankLayoutComponent,
    NavigationComponent,
    TopNavbarComponent,
    TopNavigationNavbarComponent,
    RightSidebarComponent,
    MensajeSistemaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BsDropdownModule.forRoot()
  ],
  exports: [
    FooterComponent,
    BasicLayoutComponent,
    BlankLayoutComponent,
    NavigationComponent,
    TopNavbarComponent,
    TopNavigationNavbarComponent,
    //TopNavigationLayoutComponent,
    RightSidebarComponent
  ],
})

export class LayoutsModule {}
