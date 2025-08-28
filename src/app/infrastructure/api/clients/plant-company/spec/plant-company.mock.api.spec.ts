import { describe } from 'vitest';
import { sharedPlantCompanyApiSpec } from './plant-company.api.shared-spec';
import { PlantCompanyMockApi } from '../plant-company.mock.api';

describe('PlantCompanyMockApi (contract)', () => {
  sharedPlantCompanyApiSpec(() => new PlantCompanyMockApi());
});