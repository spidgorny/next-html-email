import dotenv from 'dotenv';

dotenv.config();

export async function runTest(code: () => Promise<void>) {
  const start = process.hrtime.bigint();
  await code();
  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1_000_000;
  console.log(`Test run duration: ${durationMs.toFixed(2)} ms`);
}
