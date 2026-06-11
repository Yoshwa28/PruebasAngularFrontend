import { Component } from '@angular/core';

type ConfigTab =
  | 'trd'
  | 'clasificacion'
  | 'jwt'
  | 'feriados'
  | 'limites'
  | 'pki'
  | 'integraciones'
  | 'transferencia';

@Component({
  selector: 'app-configuration',
  imports: [],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css',
})
export class Configuration {
  activeTab: ConfigTab = 'trd';
  previewDone = false;

  setTab(tab: ConfigTab): void {
    this.activeTab = tab;
  }

  saveSerie(): void {
    console.log('Serie TRD guardada - simulación.');
  }

  previewBatch(): void {
    this.previewDone = true;
  }

  executeTransfer(): void {
    this.previewDone = true;
    console.log('Transferencia TRD ejecutada - simulación.');
  }
}
