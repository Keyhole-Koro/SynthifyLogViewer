import { createRPCClient } from './connect';
import { JobService, RelatedLogScope } from '@synthify/proto-ts/gen/synthify/tree/v1/job_pb';
import type { JobLog, JobLogDataSource, JobLogFilters, JobLogGroup, JobLogJob } from '../types';

const jobClient = createRPCClient(JobService);

export function createJobLogDataSource(): JobLogDataSource {
  return {
    async listJobLogs(jobId, pageToken) {
      const res = await jobClient.listJobLogs({ jobId, pageToken: pageToken ?? '' });
      return { logs: (res.logs ?? []).map(toJobLog), nextPageToken: res.nextPageToken ?? '' };
    },
    async searchJobLogs(filters, ids, pageToken) {
      const res = await jobClient.searchJobLogs({
        query: filters.query,
        workspaceId: filters.scope === 'workspace' ? (ids.workspaceId ?? '') : '',
        documentId: filters.scope === 'document' ? (ids.documentId ?? '') : '',
        jobId: filters.scope === 'job' ? ids.jobId : '',
        levels: filters.levels,
        events: filters.events,
        fromTimestamp: filters.fromTimestamp ?? '',
        toTimestamp: filters.toTimestamp ?? '',
        pageToken: pageToken ?? '',
      });
      return { logs: (res.logs ?? []).map(toJobLog), nextPageToken: res.nextPageToken ?? '' };
    },
    async listRelatedJobLogs(scope, ids, pageToken) {
      const res = await jobClient.listRelatedJobLogs({
        scope: toRelatedScope(scope),
        jobId: scope === 'job' ? ids.jobId : '',
        documentId: scope === 'document' ? (ids.documentId ?? '') : '',
        workspaceId: scope === 'workspace' ? (ids.workspaceId ?? '') : '',
        pageToken: pageToken ?? '',
      });
      return { groups: (res.groups ?? []).map(toJobLogGroup), nextPageToken: res.nextPageToken ?? '' };
    },
  };
}

function toRelatedScope(scope: JobLogFilters['scope']) {
  switch (scope) {
    case 'job': return RelatedLogScope.JOB;
    case 'document': return RelatedLogScope.DOCUMENT;
    case 'workspace': return RelatedLogScope.WORKSPACE;
    default: return RelatedLogScope.UNSPECIFIED;
  }
}

function toJobLog(log: {
  timestamp: string; level: string; event: string; message: string;
  detailJson: string; source: string; sourceId: string;
  jobId: string; documentId: string; workspaceId: string;
}): JobLog {
  return {
    timestamp: log.timestamp, level: log.level, event: log.event,
    message: log.message, detailJson: log.detailJson, source: log.source,
    sourceId: log.sourceId, jobId: log.jobId, documentId: log.documentId,
    workspaceId: log.workspaceId,
  };
}

function toJobLogJob(job: {
  jobId: string; status: number; createdAt: string;
  logs: Array<{ timestamp: string; level: string; event: string; message: string; detailJson: string; source: string; sourceId: string; jobId: string; documentId: string; workspaceId: string }>;
}): JobLogJob {
  return { jobId: job.jobId, status: job.status, createdAt: job.createdAt, logs: (job.logs ?? []).map(toJobLog) };
}

function toJobLogGroup(group: {
  workspaceId: string; documentId: string;
  jobs: Array<{ jobId: string; status: number; createdAt: string; logs: Array<{ timestamp: string; level: string; event: string; message: string; detailJson: string; source: string; sourceId: string; jobId: string; documentId: string; workspaceId: string }> }>;
}): JobLogGroup {
  return { workspaceId: group.workspaceId, documentId: group.documentId, jobs: (group.jobs ?? []).map(toJobLogJob) };
}
