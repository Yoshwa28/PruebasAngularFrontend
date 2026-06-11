import { Component } from '@angular/core';

@Component({
  selector: 'app-verification',
  imports: [],
  templateUrl: './verification.html',
  styleUrl: './verification.css',
})
export class Verification {
  verified = false;

  verify(): void {
    this.verified = true;
  }

  clear(): void {
    this.verified = false;
  }

  generateCertificate(): void {
    console.log('Generar constancia - simulación.');
  }
}
