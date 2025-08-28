import { describe } from 'vitest';
import { ClientContactMockApi } from '../client-contact.mock.api';
import { sharedClientContactApiSpec } from './client-contact.api.shared-spec';

describe('ClientContactMockApi (contract)', () => {
  sharedClientContactApiSpec(() => new ClientContactMockApi());
});
