import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportUrl: string;
  reportTitle?: string;
  authToken?: string;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  reportUrl,
  reportTitle = 'Report.pdf',
  authToken,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let activeBlobUrl: string | null = null;
    const controller = new AbortController();

    async function fetchPdf() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(reportUrl, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const blob = await response.blob();
        activeBlobUrl = URL.createObjectURL(blob);
        setBlobUrl(activeBlobUrl);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load PDF');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPdf();

    return () => {
      controller.abort();
      if (activeBlobUrl) {
        URL.revokeObjectURL(activeBlobUrl);
      }
    };
  }, [isOpen, reportUrl, authToken]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 8, width: '90%', maxWidth: 800, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid #e2e8f0' }}>
          <h3>{reportTitle}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {blobUrl && (
              <a href={blobUrl} download={reportTitle} style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', borderRadius: 4, textDecoration: 'none' }}>
                Download
              </a>
            )}
            <button onClick={onClose} style={{ padding: '6px 12px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', justifyContent: 'center', background: '#f8fafc' }}>
          {loading && <p>Loading document...</p>}
          {error && (
            <div style={{ color: '#dc2626', textAlign: 'center' }}>
              <p>{error}</p>
              {blobUrl && <a href={blobUrl} download={reportTitle}>Download File Directly</a>}
            </div>
          )}
          {blobUrl && !loading && !error && (
            <Document file={blobUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              <Page pageNumber={pageNumber} />
            </Document>
          )}
        </div>

        {numPages > 1 && (
          <div style={{ padding: 12, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button disabled={pageNumber <= 1} onClick={() => setPageNumber((p) => p - 1)}>Previous</button>
            <span>Page {pageNumber} of {numPages}</span>
            <button disabled={pageNumber >= numPages} onClick={() => setPageNumber((p) => p + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};
