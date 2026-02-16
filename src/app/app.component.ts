import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AlertComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'inscription-front';
  showNavbar = false;

  constructor(private keycloak: KeycloakService) { }

  async ngOnInit() {
    const isLoggedIn = await this.keycloak.isLoggedIn();
    if (isLoggedIn) {
      this.showNavbar = this.keycloak.isUserInRole('ETUDIANT');
    }
  }
}

