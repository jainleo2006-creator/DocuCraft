import express from "express";
import path from "path";
import multer from "multer";
import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import { createServer as createViteServer } from "vite";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "healthy",
    version: "1.0.0",
    service: "DocuCraft PDF Processing API",
    timestamp: new Date().toISOString(),
  });
});

// Helper for parsing page ranges e.g. "1-3, 5, 8-10"
function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(",").map((s) => s.trim()).filter(Boolean);
  
  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        pages.add(p);
      }
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

// 1. Merge PDF
app.post("/api/v1/pdf/merge", upload.array("files"), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 2) {
      return res.status(400).json({ error: "Please provide at least 2 PDF files to merge." });
    }

    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const donorPdf = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="merged_document.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error("Error merging PDFs:", err);
    res.status(500).json({ error: "Failed to merge PDF documents. Please ensure all files are valid PDFs." });
  }
});

// 2. Split PDF
app.post("/api/v1/pdf/split", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const ranges = req.body.ranges as string;
    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const srcPdf = await PDFDocument.load(file.buffer);
    const totalPages = srcPdf.getPageCount();
    const targetPages = ranges ? parsePageRanges(ranges, totalPages) : Array.from({ length: totalPages }, (_, i) => i + 1);

    if (targetPages.length === 0) {
      return res.status(400).json({ error: `Invalid page range. Document has ${totalPages} pages.` });
    }

    const newPdf = await PDFDocument.create();
    const pageIndices = targetPages.map((p) => p - 1);
    const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="split_document.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error("Error splitting PDF:", err);
    res.status(500).json({ error: "Failed to split PDF document." });
  }
});

// 3. Compress PDF
app.post("/api/v1/pdf/compress", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    // Load with options, strip unused objects and rebuild stream structures
    const pdfDoc = await PDFDocument.load(file.buffer, { updateMetadata: false });
    
    // Clean metadata
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("DocuCraft Compressor");
    pdfDoc.setCreator("DocuCraft");

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="compressed_document.pdf"');
    res.setHeader("X-Original-Size", file.size.toString());
    res.setHeader("X-Compressed-Size", pdfBytes.length.toString());
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error("Error compressing PDF:", err);
    res.status(500).json({ error: "Failed to compress PDF document." });
  }
});

// 4. Rotate PDF
app.post("/api/v1/pdf/rotate", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const angle = parseInt(req.body.angle || "90", 10);
    const pagesStr = req.body.pages as string; // optional: "1,3,5" or undefined for all
    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const pdfDoc = await PDFDocument.load(file.buffer);
    const totalPages = pdfDoc.getPageCount();
    const targetPages = pagesStr ? parsePageRanges(pagesStr, totalPages) : Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = pdfDoc.getPages();
    for (const pageNum of targetPages) {
      const page = pages[pageNum - 1];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angle) % 360));
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="rotated_document.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error("Error rotating PDF:", err);
    res.status(500).json({ error: "Failed to rotate PDF." });
  }
});

// 5. Extract Pages
app.post("/api/v1/pdf/extract", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const pagesStr = req.body.pages as string;
    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const srcPdf = await PDFDocument.load(file.buffer);
    const totalPages = srcPdf.getPageCount();
    const targetPages = parsePageRanges(pagesStr || "1", totalPages);

    if (targetPages.length === 0) {
      return res.status(400).json({ error: "No valid pages specified for extraction." });
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(srcPdf, targetPages.map((p) => p - 1));
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="extracted_pages.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error("Error extracting pages:", err);
    res.status(500).json({ error: "Failed to extract pages." });
  }
});

// 6. Delete Pages
app.post("/api/v1/pdf/delete-pages", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const deletePagesStr = req.body.pages as string;
    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const srcPdf = await PDFDocument.load(file.buffer);
    const totalPages = srcPdf.getPageCount();
    const pagesToDelete = new Set(parsePageRanges(deletePagesStr || "", totalPages));

    if (pagesToDelete.size >= totalPages) {
      return res.status(400).json({ error: "Cannot delete all pages from the document." });
    }

    const newPdf = await PDFDocument.create();
    const pagesToKeep: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (!pagesToDelete.has(i)) {
        pagesToKeep.push(i - 1);
      }
    }

    const copiedPages = await newPdf.copyPages(srcPdf, pagesToKeep);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="trimmed_document.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error("Error deleting pages:", err);
    res.status(500).json({ error: "Failed to delete pages from PDF." });
  }
});

// 7. Watermark PDF
app.post("/api/v1/pdf/watermark", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const text = req.body.text || "CONFIDENTIAL";
    const fontSize = parseInt(req.body.fontSize || "48", 10);
    const opacity = parseFloat(req.body.opacity || "0.3");
    const rotationAngle = parseInt(req.body.rotation || "45", 10);
    const colorHex = req.body.color || "#ff0000";

    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const pdfDoc = await PDFDocument.load(file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();

    // Parse hex color
    const r = parseInt(colorHex.slice(1, 3), 16) / 255 || 0.8;
    const g = parseInt(colorHex.slice(3, 5), 16) / 255 || 0.1;
    const b = parseInt(colorHex.slice(5, 7), 16) / 255 || 0.1;

    for (const page of pages) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      page.drawText(text, {
        x: width / 2 - (textWidth / 2) * Math.cos((rotationAngle * Math.PI) / 180),
        y: height / 2 - (textHeight / 2) * Math.sin((rotationAngle * Math.PI) / 180),
        size: fontSize,
        font,
        color: rgb(r, g, b),
        opacity,
        rotate: degrees(rotationAngle),
      });
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="watermarked_document.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error("Error adding watermark:", err);
    res.status(500).json({ error: "Failed to add watermark to PDF." });
  }
});

// 8. Add Page Numbers
app.post("/api/v1/pdf/page-numbers", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const position = req.body.position || "bottom-center"; // bottom-center, bottom-right, top-right, bottom-left
    const startNum = parseInt(req.body.startNum || "1", 10);
    const format = req.body.format || "Page {n} of {total}"; // "{n}", "Page {n}", "Page {n} of {total}"
    const fontSize = parseInt(req.body.fontSize || "10", 10);

    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const pdfDoc = await PDFDocument.load(file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const currentNum = startNum + index;
      const text = format
        .replace("{n}", currentNum.toString())
        .replace("{total}", (startNum + totalPages - 1).toString());
      
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      let x = width / 2 - textWidth / 2;
      let y = 25;

      if (position === "bottom-right") {
        x = width - textWidth - 36;
        y = 25;
      } else if (position === "bottom-left") {
        x = 36;
        y = 25;
      } else if (position === "top-right") {
        x = width - textWidth - 36;
        y = height - 30;
      } else if (position === "top-center") {
        x = width / 2 - textWidth / 2;
        y = height - 30;
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    });

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="numbered_document.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error("Error adding page numbers:", err);
    res.status(500).json({ error: "Failed to add page numbers." });
  }
});

// 9. Remove Metadata
app.post("/api/v1/pdf/metadata", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const pdfDoc = await PDFDocument.load(file.buffer);
    const originalInfo = {
      title: pdfDoc.getTitle() || "None",
      author: pdfDoc.getAuthor() || "None",
      subject: pdfDoc.getSubject() || "None",
      creator: pdfDoc.getCreator() || "None",
      producer: pdfDoc.getProducer() || "None",
      creationDate: pdfDoc.getCreationDate() ? pdfDoc.getCreationDate()?.toISOString() : "None",
      modificationDate: pdfDoc.getModificationDate() ? pdfDoc.getModificationDate()?.toISOString() : "None",
    };

    // Strip metadata
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("");
    pdfDoc.setCreator("");

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="sanitized_document.pdf"');
    res.setHeader("X-Original-Metadata", JSON.stringify(originalInfo));
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error("Error stripping metadata:", err);
    res.status(500).json({ error: "Failed to remove metadata from PDF." });
  }
});

// 10. Images to PDF
app.post("/api/v1/pdf/from-images", upload.array("images"), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Please upload at least one image." });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      let image;
      const mime = file.mimetype.toLowerCase();
      if (mime.includes("png")) {
        image = await pdfDoc.embedPng(file.buffer);
      } else {
        image = await pdfDoc.embedJpg(file.buffer);
      }

      // Default A4 (595.28 x 841.89 pt) or fit to image
      const page = pdfDoc.addPage([595.28, 841.89]);
      const { width: imgW, height: imgH } = image;
      const margin = 36;
      const availableW = 595.28 - margin * 2;
      const availableH = 841.89 - margin * 2;

      const scale = Math.min(availableW / imgW, availableH / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const posX = margin + (availableW - drawW) / 2;
      const posY = margin + (availableH - drawH) / 2;

      page.drawImage(image, {
        x: posX,
        y: posY,
        width: drawW,
        height: drawH,
      });
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="images_combined.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error("Error converting images to PDF:", err);
    res.status(500).json({ error: "Failed to convert images to PDF." });
  }
});

// Feedback Endpoint
app.post("/api/v1/feedback", (req, res) => {
  try {
    const { type, email, message, toolName } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Feedback message is required." });
    }

    // Log feedback received
    console.log("=== USER FEEDBACK RECEIVED ===");
    console.log(`Type: ${type || 'General'}`);
    console.log(`Tool: ${toolName || 'General App'}`);
    console.log(`Email: ${email || 'Anonymous'}`);
    console.log(`Message: ${message}`);
    console.log("==============================");

    res.json({
      success: true,
      message: "Thank you! Your feedback has been received successfully.",
    });
  } catch (err: any) {
    console.error("Error processing feedback:", err);
    res.status(500).json({ error: "Failed to submit feedback." });
  }
});

// PDF Metadata Inspection Endpoints
app.get("/api/v1/pdf/metadata", (req, res) => {
  res.json({
    endpoint: "/api/v1/pdf/metadata",
    method: "POST",
    description: "Upload a PDF file using multipart/form-data with key 'file' to inspect document metadata (author, creation date, producer, title, etc.).",
    status: "active"
  });
});

app.post("/api/v1/pdf/metadata", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const pdfDoc = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
    const metadata = {
      title: pdfDoc.getTitle() || "None",
      author: pdfDoc.getAuthor() || "None",
      subject: pdfDoc.getSubject() || "None",
      keywords: pdfDoc.getKeywords() || [],
      producer: pdfDoc.getProducer() || "None",
      creator: pdfDoc.getCreator() || "None",
      creationDate: pdfDoc.getCreationDate() ? pdfDoc.getCreationDate()!.toISOString() : "None",
      modificationDate: pdfDoc.getModificationDate() ? pdfDoc.getModificationDate()!.toISOString() : "None",
      pageCount: pdfDoc.getPageCount(),
      fileSize: file.size,
      fileName: file.originalname,
    };

    res.json({
      success: true,
      metadata,
    });
  } catch (err: any) {
    console.error("Error reading PDF metadata:", err);
    res.status(500).json({ error: "Failed to read PDF metadata. Please ensure the file is a valid PDF." });
  }
});

// Vite Middleware & Static Serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DocuCraft PDF Platform running on port ${PORT}`);
  });
}

start();
