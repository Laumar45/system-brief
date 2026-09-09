# Embedded PDF Viewer Architecture & Security Reference

## 1. Data Fetch & Blob Lifecycle Protocol

When fetching authenticated or private PDF reports from an API, avoid setting private URLs directly in `<iframe src="...">` because iframes do not pass custom `Authorization: Bearer <token>` headers.

### Standard Pipeline
```typescript
// 1. Fetch binary stream with auth headers
const response = await fetch('/api/reports/sales-summary', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/pdf',
  },
  signal: abortController.signal,
});

if (!response.ok) {
  throw new Error(`Failed to load PDF report: ${response.statusText}`);
}

// 2. Convert to Blob & Object URL
const pdfBlob = await response.blob();
const blobUrl = URL.createObjectURL(pdfBlob);

// 3. Teardown / Cleanup on unmount (CRITICAL)
// In React:
useEffect(() => {
  return () => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }
  };
}, [blobUrl]);
```

## 2. Cross-Browser & Mobile Caveats

- **iOS Safari / Chrome Mobile**: Native `<iframe>` embedding of PDF often renders only the first page or forces an automatic download instead of rendering inline. For mobile-first or responsive apps, use PDF.js canvas rendering or provide a button that opens the Blob URL in a new browser tab (`target="_blank" rel="noopener noreferrer"`).
- **Content Security Policy (CSP)**: Allow only the schemes used by the selected strategy. For Blob URLs:
  `Content-Security-Policy: default-src 'self'; frame-src 'self' blob:; object-src 'self' blob:; worker-src 'self' blob:;`
  Add `data:` to `frame-src` or `object-src` only when using a data URL.

## 3. Sandboxing & Security

When using `<iframe>`:
```html
<iframe
  src="blob:http://example.com/uuid"
  title="PDF Report Viewer"
  sandbox="allow-scripts allow-same-origin allow-forms"
  loading="lazy"
  style="width: 100%; height: 100%; border: none;"
></iframe>
```

## 4. Streamlit

For Streamlit versions that expose `st.pdf`, use `st.pdf(pdf_bytes, height=...)` instead of an HTML `<object>` inside `st.components.v1.html`. Install the optional component with `pip install "streamlit[pdf]"`, add the extra to the dependency manifest, and restart the Streamlit server after installation so the component manifest is discovered.
