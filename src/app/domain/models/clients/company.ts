export type Industry =
| 'AEROESPACIAL'
| 'MINERIA'
| 'SIDERURGIA'
| 'NUCLEAR'
| 'EQUIPOS_INDUSTRIALES'
| 'OIL_AND_GAS'
| 'TRANSPORTE'
| 'CONSTRUCCION'
| 'NAVAL';


export interface Company {
id: number;
name: string;
commercialName?: string;
logo?: string;
industry?: Industry;
group?: string;
}


export interface CreateCompanyRequest {
name: string;
commercialName?: string;
logo?: string;
industry?: Industry;
group?: string;
}