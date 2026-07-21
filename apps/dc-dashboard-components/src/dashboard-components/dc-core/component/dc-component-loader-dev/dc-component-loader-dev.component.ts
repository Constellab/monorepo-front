import { ChangeDetectionStrategy,Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface DevNavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'dc-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatListModule, MatIconModule],
  templateUrl: './dc-component-loader-dev.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dc-component-loader-dev.component.scss',
})
export class DcComponentLoaderDevComponent {
  navItems: DevNavItem[] = [
    { path: 'input-search', label: 'Input Search', icon: 'search' },
    { path: 'select-resource', label: 'Select Resource', icon: 'inventory_2' },
    { path: 'menu', label: 'Menu', icon: 'menu' },
    { path: 'tree', label: 'Tree', icon: 'account_tree' },
    { path: 'text-editor', label: 'Text Editor', icon: 'edit_note' },
  ];
}
