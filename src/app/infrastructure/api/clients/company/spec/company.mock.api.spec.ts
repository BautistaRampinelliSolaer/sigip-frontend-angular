import { describe } from 'vitest';
import { sharedCompanyApiSpec } from './company.api.shared-spec';
import { CompanyMockApi } from '../company.mock.api';

describe('CompanyMockApi (contract)', () => {
  sharedCompanyApiSpec(() => new CompanyMockApi());
});
