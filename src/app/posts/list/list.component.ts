import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Post } from '../interfaces/post.entity';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { tap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export default class ListComponent {
  data?: Post[];
  loading = true;
  error?: string;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(page = 1, limit = 5) {
    this.loading = true;
    let skip = (page - 1) * limit;

    return this.http
      .get<Post[]>(
        `${environment.apiBaseUrl}/posts?_start=${skip}&_limit=${limit}`
      )
      .subscribe({
        next: (res) => {
          this.data = res;
        },
        error: () => {
          this.error = 'cannot load posts!';
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  handlePagination(ev: PageEvent) {
    this.getPosts(ev.pageIndex + 1, ev.pageSize);
  }
}
