import { NextResponse } from 'next/server';
import { createRPCClient } from '@/lib/connect';
import { JobService } from '@synthify/proto-ts/gen/synthify/tree/v1/job_pb';

export async function GET() {
  const jobClient = createRPCClient(JobService);
  const res = await jobClient.listAllJobs({});
  return NextResponse.json({ jobs: res.jobs ?? [] });
}
