import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostDetailsService } from './post-details.service';
import { Post } from '#app/posts/interfaces/post.entity';
import { Comment } from '#app/posts/interfaces/comment.interface';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
})
export default class PostDetailsComponent {
  data?: Post;
  comments?: Comment[];
  error?: string;
  loading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: PostDetailsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.loading = true;
        let postId = +params.get('id')!;
        this.service.getPostDetails(postId).subscribe({
          next: (res) => {
            this.data = res;
            this.service
              .getComments(postId)
              .subscribe({
                next: (comments) => {
                  this.comments = comments;
                },
                error: () => {
                  this.error = 'loading comments failed!';
                },
              })
              .add(() => {
                this.loading = false;
              });
          },
          error: () => {
            this.error = 'this post is not found!';
          },
        });
      },
    });
  }
}
