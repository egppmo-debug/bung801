export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
}

/**
 * List Google Docs and PDF files from user's Google Drive
 */
export async function listDriveDocuments(
  accessToken: string, 
  searchQuery?: string
): Promise<DriveFileItem[]> {
  try {
    let q = "trashed = false and (mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/pdf')";
    if (searchQuery?.trim()) {
      const cleanSearch = searchQuery.replace(/'/g, "\\'");
      q += ` and name contains '${cleanSearch}'`;
    }

    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.set('q', q);
    url.searchParams.set('fields', 'files(id, name, mimeType, iconLink, modifiedTime, size, webViewLink)');
    url.searchParams.set('orderBy', 'modifiedTime desc');
    url.searchParams.set('pageSize', '30');

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Google Drive 요청 실패 (${res.status})`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (error: any) {
    console.error('Failed to list drive files:', error);
    throw error;
  }
}

/**
 * Fetch Google Doc content as plain text using Drive Export API
 */
export async function fetchGoogleDocContent(
  accessToken: string,
  fileId: string
): Promise<string> {
  const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
  const res = await fetch(exportUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    // If export fails, attempt reading via Docs API
    const docsUrl = `https://docs.googleapis.com/v1/documents/${fileId}`;
    const docRes = await fetch(docsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!docRes.ok) {
      throw new Error(`구글 문서를 읽을 수 없습니다. (상태 코드: ${res.status})`);
    }

    const docData = await docRes.json();
    let text = '';
    if (docData.body?.content) {
      for (const element of docData.body.content) {
        if (element.paragraph?.elements) {
          for (const pe of element.paragraph.elements) {
            if (pe.textRun?.content) {
              text += pe.textRun.content;
            }
          }
        }
      }
    }
    return text;
  }

  return await res.text();
}

/**
 * Fetch a PDF file from Google Drive as base64 string
 */
export async function fetchDrivePdfBase64(
  accessToken: string,
  fileId: string
): Promise<{ base64: string; size: number }> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Google Drive에서 PDF 파일을 다운로드하지 못했습니다 (${res.status})`);
  }

  const blob = await res.blob();
  const arrayBuffer = await blob.arrayBuffer();
  
  // Convert ArrayBuffer to base64
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  return { base64, size: blob.size };
}
