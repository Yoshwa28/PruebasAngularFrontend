import { Component } from '@angular/core';

interface SearchResult {
  rep: string;
  document: string;
  dependency: string;
  classification: string;
  pki: string;
  trd: string;
}

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  results: SearchResult[] = [
    {
      rep: 'REP-2026-000123',
      document: 'Plan Operativo Regional 2026',
      dependency: 'Gerencia General Regional',
      classification: 'Público',
      pki: 'Firmado',
      trd: 'Vigente',
    },
    {
      rep: 'REP-2026-000188',
      document: 'Informe técnico de obra vial',
      dependency: 'Sub Gerencia de Obras',
      classification: 'Interno',
      pki: 'Firmado',
      trd: 'Vigente',
    },
    {
      rep: 'REP-2026-000222',
      document: 'Acta de comité de inversiones',
      dependency: 'Gerencia Regional de Infraestructura',
      classification: 'Restringido',
      pki: 'Sin firma',
      trd: 'Vencido',
    },
  ];

  search(): void {
    console.log('Buscar documentos - simulación.');
  }

  clear(): void {
    console.log('Limpiar filtros - simulación.');
  }
}
