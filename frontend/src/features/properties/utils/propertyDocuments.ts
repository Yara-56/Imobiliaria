const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5050"
).replace(/\/$/, "");

export type PropertyDocumentLike = {
  fileName?: string;
  fileUrl?: string;
  mimeType?: string | null;
  size?: number | null;

  // compatibilidade com formato antigo
  originalName?: string;
  filename?: string;
  url?: string;
};

export function getDocumentDisplayName(doc: PropertyDocumentLike) {
  return doc.fileName || doc.originalName || doc.filename || "Documento";
}

export function getDocumentRelativePath(doc: PropertyDocumentLike) {
  const directPath = doc.fileUrl || doc.url;

  if (directPath?.trim()) {
    return directPath.trim();
  }

  if (doc.filename?.trim()) {
    return `/uploads/properties/${doc.filename.trim()}`;
  }

  return "";
}

export function resolveDocumentUrl(doc: PropertyDocumentLike) {
  const relativePath = getDocumentRelativePath(doc);

  if (!relativePath) return "";

  if (/^https?:\/\//i.test(relativePath)) {
    return relativePath;
  }

  const normalized = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;

  return `${API_BASE_URL}${normalized}`;
}