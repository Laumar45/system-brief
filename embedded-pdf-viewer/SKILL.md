---
name: embedded-pdf-viewer
description: "Trigger: pdf report, pdf reports, descargar pdf, download pdf, embedded pdf, pdf viewer, visor pdf, in-browser pdf. Implement in-browser embedded PDF viewers and previewers alongside direct download options."
license: Apache-2.0
metadata:
  author: "Laumar"
  version: "1.0"
---

## Activation Contract

Activate when:
- User asks for PDF reports, PDF downloads, document previews, or PDF export in web applications.
- User wants an in-browser PDF reader, modal previewer, or embedded split-view dashboard.
- Converting existing "blind download" buttons into an interactive preview + download experience.

Do not activate for:
- Backend-only PDF compilation (e.g. JasperReports, Puppeteer workers, LaTeX).
- Commercial paid PDF SDKs (Adobe PDF Embed API with keys, PSPDFKit).

## Hard Rules

- **Preview First**: Never provide only a blind download button for PDF reports. Always provide an in-browser previewer (modal, drawer, or embedded panel) paired with a direct download action.
- **Memory Safety**: Always revoke generated Blob URLs with `URL.revokeObjectURL(blobUrl)` inside component cleanup/unmount hooks (`useEffect`, `onUnmounted`, `onDestroy`) to prevent SPA memory leaks.
- **Guaranteed Download Fallback**: Always render a visible direct download button/link alongside the viewer as a fallback if embedding is blocked or fails.
- **Sandbox & Security**: Apply the narrowest practical sandbox to `<iframe>` tags. Ensure CSP allows every scheme actually used (`blob:` or `data:`) in `frame-src` and `object-src`; do not add unused schemes.
- **Framework Constraints**: Treat native `<iframe>`/`<object>` embedding as conditional. Sandboxed component hosts, including Streamlit, may reject browser PDF plugins even when the browser supports them.
- **Mobile Graceful Handling**: If targeting mobile viewports where native `<iframe>` embedding forces file downloads, fall back to opening the Blob URL in a new tab or use a PDF.js canvas renderer.

## Decision Gates

| Requirement / Environment | Strategy | Implementation Reference |
|---|---|---|
| Streamlit app | `st.pdf(pdf_bytes)`; install `streamlit[pdf]` and restart the running server after installation | Streamlit's built-in PDF component |
| Traditional HTML host with browser PDF support | Native In-Browser Embed | `<iframe>` or `<object>` with `blob:` URL. See `assets/native-viewer.html` |
| Sandboxed host, mobile target, or full UI control | Mozilla PDF.js & Canvas with a locally bundled worker | `pdfjs-dist` worker rendering to `<canvas>`. See `assets/pdfjs-viewer-template.ts` |
| React / Next.js SPA | React Wrapper | `react-pdf` with modal lifecycle. See `assets/react-pdf-wrapper.tsx` |
| Vue 3 / Nuxt 3 SPA | Vue Wrapper | `vue-pdf-embed` with reactive page & zoom state |
| Authenticated API endpoint | Fetch -> Blob Pipeline | Fetch binary with `Authorization` -> `response.blob()` -> `URL.createObjectURL` |

## Execution Steps

1. **Scan Runtime and Data Source**: Identify the host framework, browser/mobile constraints, authentication, and whether the PDF is an API response, public URL, or in-memory blob/file.
2. **Select Embedding Strategy**: Use Decision Gates. Prefer the host framework's maintained PDF component; use native embedding only when the host permits browser PDF plugins; otherwise use PDF.js with a locally bundled worker.
3. **Build Fetch & State Pipeline**:
   - Fetch binary stream with required authentication headers and `AbortController`.
   - Manage `idle`, `loading`, `ready`, and `error` states.
   - Convert binary data to `blob:` URL with `URL.createObjectURL`.
   - For framework components that accept bytes directly, pass the bytes and avoid creating a Blob URL.
   - When adding an optional package, update the dependency manifest and restart the development server before validating.
4. **Implement UI Pattern**: Wrap the viewer in a Modal, Drawer, or In-Page Split View. Provide Download and the controls supported by the selected strategy (Print, Zoom, Close, or page navigation).
5. **Attach Lifecycle Teardown**: Call `URL.revokeObjectURL` on unmount.
6. **Verify Fallback**: Confirm the download button functions independently if the viewer fails.

## Output Contract

Return:
- Selected viewer strategy and architectural justification.
- Integrated component code with complete state handling, memory cleanup, and error fallback.
- Visible download action and the supported viewer controls; explicitly note unsupported controls.

## References

- `references/architecture-patterns.md` — Detailed lifecycle, security CSP, and cross-browser handling.
- `assets/native-viewer.html` — Zero-dependency HTML5 iframe / object template.
- `assets/pdfjs-viewer-template.ts` — PDF.js worker canvas renderer.
- `assets/react-pdf-wrapper.tsx` — Idiomatic React / Next.js previewer modal.
