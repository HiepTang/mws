import { S3Client } from "@aws-sdk/client-s3";

// MinIO is S3-compatible. The kho-ai instance is reachable as `minio:9000`
// over the shared khoai-network when running in a sibling Compose project.
// Path-style addressing is required (MinIO doesn't do virtual-hosted-style by
// default, and we'd need wildcard DNS to make it work either way).

let cached: S3Client | null = null;

export function getS3Client(): S3Client {
  if (cached) return cached;

  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY;
  const secretAccessKey = process.env.S3_SECRET_KEY;
  const region = process.env.S3_REGION ?? "us-east-1";
  const forcePathStyle = (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true";

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "S3 client is not configured. Set S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY in the environment.",
    );
  }

  cached = new S3Client({
    endpoint,
    region,
    forcePathStyle,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cached;
}

export const S3_BUCKET = process.env.S3_BUCKET ?? "mws-uploads";
