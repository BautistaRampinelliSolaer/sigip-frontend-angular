import { describe } from 'vitest';
import { sharedClientContactApiSpec } from './client-contact.api.shared-spec';
import { ClientContactMockApi } from '../client-contact.api.mock';

describe('ClientContactMockApi (contract)', () => {
  sharedClientContactApiSpec(() => new ClientContactMockApi());
});
