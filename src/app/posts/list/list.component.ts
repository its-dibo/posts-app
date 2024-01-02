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

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export default class ListComponent {
  data?: Post[];
  start?: number;
  limit?: number;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPosts().subscribe({
      next: (res) => {
        this.data = res;
        console.log(res.length);
      },
    });
  }

  getPosts(start = 0, limit = 5) {
    this.loading = true;
    return this.http
      .get<Post[]>(
        `${environment.apiBaseUrl}/posts?_start=${start}&_limit=${limit}`
      )
      .pipe(
        tap(() => {
          this.loading = false;
        })
      );
  }
}
