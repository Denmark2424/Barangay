import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed$;

  constructor(
    public auth: AuthService,
    private layoutService: LayoutService,
    private router: Router
  ) {
    this.isCollapsed$ = this.layoutService.isSidebarCollapsed$;
  }

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }
}
