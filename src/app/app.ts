import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NavbarComponent, FooterComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isLoggedIn$;
  isSidebarCollapsed$;

  constructor(private auth: AuthService, private layoutService: LayoutService) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
    this.isSidebarCollapsed$ = this.layoutService.isSidebarCollapsed$;
  }
}
