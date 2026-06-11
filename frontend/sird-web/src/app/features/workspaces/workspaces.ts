import { Component } from '@angular/core';

interface CollaborativeSpace {
  rep: string;
  name: string;
  type: string;
  dependency: string;
  responsible: string;
  quota: number;
}

interface SpaceFile {
  name: string;
  folder: string;
  type: string;
  size: string;
  version: string;
  status: 'En revisión' | 'Firmado' | 'Borrador';
  hash: string;
}

@Component({
  selector: 'app-workspaces',
  imports: [],
  templateUrl: './workspaces.html',
  styleUrl: './workspaces.css',
})
export class Workspaces {
  activeView: 'list' | 'internal' = 'list';
  activeTab: 'files' | 'structure' | 'participants' | 'activity' | 'closure' =
    'files';

  showSignModal = false;
  selectedFileName = 'acta_reunion_01.docx';

  spaces: CollaborativeSpace[] = [
    {
      rep: 'REP-2026-000700',
      name: 'Mesa técnica vial Cusco Sur',
      type: 'Proyecto',
      dependency: 'Sub Gerencia de Obras',
      responsible: 'Lucía Quispe Mamani',
      quota: 68,
    },
    {
      rep: 'REP-2026-000701',
      name: 'Seguimiento de mantenimiento vial',
      type: 'Expediente de trabajo',
      dependency: 'Sub Gerencia de Obras',
      responsible: 'Lucía Quispe Mamani',
      quota: 45,
    },
    {
      rep: 'REP-2026-000702',
      name: 'Coordinación administrativa regional',
      type: 'Mesa de trabajo',
      dependency: 'Mesa de Servicios Administrativos',
      responsible: 'María Rodríguez Quispe',
      quota: 52,
    },
    {
      rep: 'REP-2026-000703',
      name: 'Integraciones institucionales SIRD',
      type: 'Control técnico',
      dependency: 'Oficina de Tecnologías de la Información',
      responsible: 'María Rodríguez Quispe',
      quota: 32,
    },
  ];

  selectedSpace = this.spaces[0];

  files: SpaceFile[] = [
    {
      name: 'acta_reunion_01.docx',
      folder: '01_Actas',
      type: 'Acta',
      size: '4.8 MB',
      version: 'v02',
      status: 'En revisión',
      hash: 'Pendiente',
    },
    {
      name: 'informe_avance_vial.pdf',
      folder: '03_Informes',
      type: 'Informe',
      size: '18.2 MB',
      version: 'v03',
      status: 'Firmado',
      hash: 'ecf002aa77bb88cc99',
    },
    {
      name: 'anexo_fotografico.zip',
      folder: '02_Anexos',
      type: 'Anexo',
      size: '96.4 MB',
      version: 'v01',
      status: 'Borrador',
      hash: 'Pendiente',
    },
  ];

  selectSpace(space: CollaborativeSpace): void {
    this.selectedSpace = space;
  }

  openSpace(): void {
    this.activeView = 'internal';
    this.activeTab = 'files';
  }

  backToSpaces(): void {
    this.activeView = 'list';
  }

  setTab(tab: 'files' | 'structure' | 'participants' | 'activity' | 'closure'): void {
    this.activeTab = tab;
  }

  openSignModal(fileName: string): void {
    this.selectedFileName = fileName;
    this.showSignModal = true;
  }

  closeSignModal(): void {
    this.showSignModal = false;
  }

  signFile(): void {
    this.showSignModal = false;
    console.log(`Archivo firmado: ${this.selectedFileName}`);
  }

  uploadFile(): void {
    console.log('Subir archivo - simulación.');
  }

  createFolder(): void {
    console.log('Nueva carpeta - simulación.');
  }
}
