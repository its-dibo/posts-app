import { Component, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { of, tap } from 'rxjs';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '#environments/environment';
import { Post } from '../interfaces/post.entity';

@Component({
  selector: 'app-posts-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    MatButtonModule,
  ],
})
export default class PostsEditorComponent {
  formGroup = new FormGroup({});
  fields?: FormlyFieldConfig[];
  loading = true;
  error?: string;
  model?: Partial<Post>;
  id?: string | null;
  message?: {
    text: string;
    status: 'error' | 'ok' | 'warn';
  };

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.loading = true;
        this.id = params.get('id');
        this.getData().subscribe({
          next: () => {
            this.fields = [
              {
                key: 'title',
                type: 'input',
                props: {
                  label: 'title',
                  required: true,
                  minLength: 10,
                },
              },
              {
                key: 'body',
                // todo: replace with textarea
                type: 'input',
                props: {
                  label: 'content',
                  placeholder: 'write something...',
                  required: true,
                  minLength: 10,
                  cols: 100,
                  rows: 10,
                },
              },
            ];
            this.loading = false;
          },
          error: (err) => {
            this.error = err;
          },
        });
      },
    });
  }

  getData() {
    return this.id
      ? this.http.get<Post>(`${environment.apiBaseUrl}/posts/${this.id}`).pipe(
          tap((res) => {
            if (!res) throw new Error(`this post doesn't exist`);
            this.model = res;
          })
        )
      : of({});
  }

  onSubmit(): void {
    this.loading = true;
    let endpoint = `${environment.apiBaseUrl}/posts`,
      data = { ...this.model, userId: 1 };

    (this.id
      ? this.http.put<{ id: string }>(`${endpoint}/${this.id}`, data)
      : this.http.post<{ id: string }>(endpoint, data)
    )
      .subscribe({
        next: (res) => {
          this.message = {
            status: 'ok',
            text: `the post is created successfully. <a href="/posts/${
              res.id || this.id
            }">view</a>`,
          };
          // reset the form after creating a new post
          !this.id && this.formGroup.reset();
        },
        error: (err) => {
          if (isDevMode()) console.error(err);
          this.message = {
            status: 'error',
            text: err.error?.message || err.message || err.error || err,
          };
        },
      })
      .add(() => {
        this.loading = false;
        window.scroll({ top: 0, behavior: 'smooth' });
      });
  }
}
