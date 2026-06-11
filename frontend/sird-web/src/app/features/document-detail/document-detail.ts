import { Component } from '@angular/core';

@Component({
  selector: 'app-document-detail',
  imports: [],
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.css',
})
export class DocumentDetail {
  openViewer(): void {
    console.log('Abrir visor documental - simulación.');
  }

  download(): void {
    console.log('Descargar documento - simulación.');
  }

  viewRep(): void {
    console.log('Ver REP - simulación.');
  }

  viewHistory(): void {
    console.log('Ver historial - simulación.');
  }
}
