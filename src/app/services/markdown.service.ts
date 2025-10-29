import { Injectable } from '@angular/core';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor() {
    // Configure marked for GitHub Flavored Markdown
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
  }

  /**
   * Convert markdown to sanitized HTML
   */
  async render(markdown: string): Promise<string> {
    if (!markdown) return '';
    
    try {
      const html = await marked.parse(markdown);
      // Sanitize to prevent XSS attacks
      return DOMPurify.sanitize(html, {
        ADD_ATTR: ['target'], // Allow target attribute for links
        ADD_TAGS: ['iframe'], // Allow iframes for embeds (optional)
      });
    } catch (error) {
      console.error('Markdown rendering error:', error);
      return DOMPurify.sanitize(markdown);
    }
  }

  /**
   * Render inline markdown (for short text, no code blocks)
   */
  async renderInline(markdown: string): Promise<string> {
    if (!markdown) return '';
    
    try {
      const html = await marked.parseInline(markdown);
      return DOMPurify.sanitize(html);
    } catch (error) {
      console.error('Inline markdown rendering error:', error);
      return DOMPurify.sanitize(markdown);
    }
  }
}
