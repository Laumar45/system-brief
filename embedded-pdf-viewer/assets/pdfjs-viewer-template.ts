import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure the worker from the local bundle instead of a third-party CDN.
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface PdfViewerOptions {
  container: HTMLElement;
  url: string;
  authToken?: string;
  scale?: number;
}

export class CustomPdfViewer {
  private pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;
  private currentPage = 1;
  private scale = 1.2;
  private container: HTMLElement;
  private blobUrl: string | null = null;

  constructor(options: PdfViewerOptions) {
    this.container = options.container;
    this.scale = options.scale ?? 1.2;
    this.loadDocument(options.url, options.authToken);
  }

  public async loadDocument(url: string, token?: string): Promise<void> {
    try {
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const blob = await response.blob();
      this.blobUrl = URL.createObjectURL(blob);

      const arrayBuffer = await blob.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      this.pdfDoc = await loadingTask.promise;
      this.renderPage(this.currentPage);
    } catch (error) {
      console.error('Failed to load PDF document:', error);
      this.renderError();
    }
  }

  public async renderPage(pageNumber: number): Promise<void> {
    if (!this.pdfDoc) return;
    this.currentPage = pageNumber;

    const page = await this.pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: this.scale });

    let canvas = this.container.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      this.container.innerHTML = '';
      this.container.appendChild(canvas);
    }

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
  }

  public getBlobUrl(): string | null {
    return this.blobUrl;
  }

  public destroy(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
    }
    if (this.pdfDoc) {
      this.pdfDoc.destroy();
      this.pdfDoc = null;
    }
    this.container.innerHTML = '';
  }

  private renderError(): void {
    this.container.innerHTML = `
      <div style="padding: 24px; text-align: center; color: #ef4444;">
        <p>Failed to render PDF preview.</p>
        ${this.blobUrl ? `<a href="${this.blobUrl}" download="report.pdf">Download File Directly</a>` : ''}
      </div>
    `;
  }
}
