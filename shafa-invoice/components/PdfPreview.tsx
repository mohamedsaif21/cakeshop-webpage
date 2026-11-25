"use client";
import { useEffect, useRef, useState } from "react";

// pdf.js renders the REAL generated PDF to canvases, so the preview is exactly what the customer receives.
export default function PdfPreview({ blob }: { blob: Blob }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        const data = new Uint8Array(await blob.arrayBuffer());
        const pdf = await pdfjs.getDocument({ data }).promise;
        const el = wrap.current;
        if (!el || cancelled) return;
        const cssW = el.clientWidth || 340;
        const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        const canvases: HTMLCanvasElement[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const base = page.getViewport({ scale: 1 });
          const vp = page.getViewport({ scale: (cssW / base.width) * dpr });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp }).promise;
          if (cancelled) return;
          canvases.push(canvas);
        }
        el.replaceChildren(...canvases);
        setError("");
      } catch (e) {
        if (!cancelled) setError("Preview could not load. You can still send or download the PDF.");
        console.error(e);
      }
    })();
    return () => { cancelled = true; };
  }, [blob]);

  return (
    <>
      <div ref={wrap} className="sdh-pdf" aria-label="Invoice preview" />
      {error && <p className="sdh-err">{error}</p>}
    </>
  );
}
