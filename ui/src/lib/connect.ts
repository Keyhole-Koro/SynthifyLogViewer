import { createClient, type Client } from '@connectrpc/connect';
import type { DescService } from '@bufbuild/protobuf';
import { createConnectTransport } from '@connectrpc/connect-web';
import { config } from '../config';

const baseUrl =
  typeof window === 'undefined'
    ? (config.INTERNAL_API_BASE_URL ?? config.NEXT_PUBLIC_API_BASE_URL)
    : config.NEXT_PUBLIC_API_BASE_URL;

const transport = createConnectTransport({
  baseUrl,
});

export function createRPCClient<T extends DescService>(service: T): Client<T> {
  return createClient(service, transport);
}
