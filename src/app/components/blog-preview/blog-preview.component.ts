import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { BlogPreviewItemComponent } from '../blog-preview-item/blog-preview-item.component';
import { BlogMetadata, DatabaseApiEndpointResponse, GetBlogMetadataApiEndpointResponse } from '../../..';
import { BlogService } from '../../services/blog.service';
import { NotificationService } from '../../services/notification.service';
import { PUBLIC_CONFIG } from '../../../publicConfig';

@Component({
  selector: 'app-blog-preview',
  imports: [BlogPreviewItemComponent],
  templateUrl: './blog-preview.component.html',
  styleUrl: './blog-preview.component.scss',
})
export class BlogPreviewComponent implements OnInit {
    numberOfItems = input.required<number>();

    blogs = signal<BlogMetadata[]>([])

    private blogService = inject(BlogService);
    private notificationService = inject(NotificationService);

    private _updateBlogs = effect(() => {
        this.getBlogMetadata(this.numberOfItems());
    })

    ngOnInit(): void {
        this.getBlogMetadata(this.numberOfItems());
    }

    getBlogMetadata(count: number): void {

        const request = this.blogService.getBlogMetadata(count);
        request.subscribe((response: GetBlogMetadataApiEndpointResponse) => {
          this.blogs.set([]);

          if (response.error) {
            this.notificationService.error("Fehler", "Die Blog-Vorschau konnte nicht geladen werden: " + response.message);
          } else {
            this.blogs.set(response.data);
          }

          while (this.blogs().length < this.numberOfItems()) {
            this.blogs.update((blogs) => {
              blogs.push({
                title: "Fehler",
                subtitle: "Die Blog-Vorschau konnte nicht geladen werden.",
                author: "",
                imageUrl: PUBLIC_CONFIG.FALLBACK_IMAGE_URL,
                imageAlt: "Platzhalter",
              })

              return blogs;
            })
          }
        });
    }

}
