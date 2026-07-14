import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

/**
 * Supabase Storage over the S3 protocol — holds the invoice PDFs
 * (bucket `invoices`, keys `<invoiceNumber>.pdf`).
 * Returns null when the S3 env vars aren't configured.
 */
declare global {
  // eslint-disable-next-line no-var
  var __fbcloneS3: S3Client | undefined;
}

function getClient(): S3Client | null {
  const { S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } =
    process.env;
  if (!S3_ENDPOINT || !S3_REGION || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY)
    return null;
  if (!global.__fbcloneS3) {
    global.__fbcloneS3 = new S3Client({
      endpoint: S3_ENDPOINT,
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true, // required for Supabase's S3 endpoint
    });
  }
  return global.__fbcloneS3;
}

const bucket = () => process.env.S3_BUCKET ?? "invoices";

export async function getPdfFromStorage(
  invoiceNumber: string
): Promise<Buffer | null> {
  const s3 = getClient();
  if (!s3) return null;
  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: bucket(), Key: `${invoiceNumber}.pdf` })
    );
    if (!res.Body) return null;
    return Buffer.from(await res.Body.transformToByteArray());
  } catch {
    return null; // missing object or transient error — caller falls back
  }
}

export async function putPdfToStorage(
  invoiceNumber: string,
  pdf: Buffer
): Promise<boolean> {
  const s3 = getClient();
  if (!s3) return false;
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: `${invoiceNumber}.pdf`,
      Body: pdf,
      ContentType: "application/pdf",
    })
  );
  return true;
}
