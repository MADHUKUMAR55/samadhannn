import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const rawPublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || '';
const publisherId = rawPublisherId.trim().replace(/^ca-/, '');
const outDir = join(process.cwd(), 'out');
const outFile = join(outDir, 'ads.txt');

if (!/^pub-\d+$/.test(publisherId)) {
  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, '# NEXT_PUBLIC_ADSENSE_PUB_ID is not configured.\n');
  console.warn('Generated placeholder ads.txt: NEXT_PUBLIC_ADSENSE_PUB_ID must look like ca-pub-1234567890123456.');
  process.exit(0);
}

await mkdir(outDir, { recursive: true });
await writeFile(outFile, `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`);
console.log(`Generated ${outFile}`);
