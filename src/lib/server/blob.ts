import { env } from '$env/dynamic/private';
import { get, list, type ListBlobResultBlob } from '@vercel/blob';

const RUNS_PREFIX = 'runs/';

function getBlobToken(): string {
	const token = env.BLOB_READ_WRITE_TOKEN;

	if (!token) {
		throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
	}

	return token;
}

export async function listRunBlobs(): Promise<ListBlobResultBlob[]> {
	const token = getBlobToken();
	const blobs: ListBlobResultBlob[] = [];
	let cursor: string | undefined;

	do {
		const page = await list({
			cursor,
			limit: 1000,
			prefix: RUNS_PREFIX,
			token
		});

		blobs.push(...page.blobs);
		cursor = page.cursor;
	} while (cursor);

	return blobs.filter((blob) => blob.pathname.endsWith('.json'));
}

export async function readBlobText(blob: ListBlobResultBlob): Promise<string> {
	const token = getBlobToken();

	try {
		const publicResult = await get(blob.url, {
			access: 'public',
			token,
			useCache: false
		});

		if (publicResult?.statusCode === 200) {
			return new Response(publicResult.stream).text();
		}
	} catch {
		// Some stores use private blobs. Fall back to an authenticated private read.
	}

	const privateResult = await get(blob.pathname, {
		access: 'private',
		token,
		useCache: false
	});

	if (!privateResult || privateResult.statusCode !== 200) {
		throw new Error(`Unable to read blob: ${blob.pathname}`);
	}

	return new Response(privateResult.stream).text();
}
