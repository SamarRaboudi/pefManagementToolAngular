import { Routes } from '@angular/router';
import * as path from 'path';


export const PagesRoutes: Routes = [
 {
    path:'admin',
    loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
}
    
];
