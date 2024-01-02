import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./posts/list/list.component'),
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('./posts/post-details/post-details.component'),
  },
];
