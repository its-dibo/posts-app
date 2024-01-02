import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '#app/posts/interfaces/post.entity';
import { Comment } from '#app/posts/interfaces/comment.interface';
import { environment } from '#environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostDetailsService {
  constructor(private http: HttpClient) {}

  getPostDetails(postId: number) {
    return this.http.get<Post>(`${environment.apiBaseUrl}/posts/${postId}`);
  }

  getComments(postId: number) {
    return this.http.get<Comment[]>(
      `${environment.apiBaseUrl}/comments/?postId=${postId}`
    );
  }
}
