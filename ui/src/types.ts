export interface JobLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | string;
  event: string;
  message: string;
  detailJson: string;
  source: 'system' | 'tool' | string;
  sourceId: string;
  jobId: string;
  documentId: string;
  workspaceId: string;
}

export interface JobLogJob {
  jobId: string;
  status: number;
  createdAt: string;
  logs: JobLog[];
}

export interface JobLogGroup {
  workspaceId: string;
  documentId: string;
  jobs: JobLogJob[];
}

export interface JobLogFilters {
  query: string;
  levels: string[];
  events: string[];
  scope: 'job' | 'document' | 'workspace';
  fromTimestamp?: string;
  toTimestamp?: string;
}

export interface JobLogDataSource {
  listJobLogs(jobId: string, pageToken?: string): Promise<{ logs: JobLog[], nextPageToken: string }>;
  searchJobLogs(filters: JobLogFilters, ids: { jobId: string; documentId?: string; workspaceId?: string }, pageToken?: string): Promise<{ logs: JobLog[], nextPageToken: string }>;
  listRelatedJobLogs(scope: JobLogFilters['scope'], ids: { jobId: string; documentId?: string; workspaceId?: string }, pageToken?: string): Promise<{ groups: JobLogGroup[], nextPageToken: string }>;
}
