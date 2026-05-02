import { NextResponse } from 'next/server';
import { createRPCClient } from '@/lib/connect';
import { JobService } from '@synthify/proto-ts/gen/synthify/tree/v1/job_pb';

export async function GET() {
  const jobClient = createRPCClient(JobService);
  try {
    const res = await Promise.race([
      jobClient.listAllJobs({}),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('listAllJobs timed out')), 3000);
      }),
    ]);
    return NextResponse.json({ jobs: res.jobs ?? [] });
  } catch (error) {
    console.error('log-viewer jobs fallback:', error);
    return NextResponse.json({ jobs: [] });
  }
}
