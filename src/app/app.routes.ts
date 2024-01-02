import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'posts/editor',
    loadComponent: () => import('./posts/editor/editor.component'),
  },
  {
    path: 'posts/editor/:id',
    loadComponent: () => import('./posts/editor/editor.component'),
  },
  {
    path: '',
    loadComponent: () => import('./posts/list/list.component'),
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('./posts/post-details/post-details.component'),
  },
];
