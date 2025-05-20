export type lang =
    | 'en'
    | 'fr'
    | 'hi';

export interface RequestExtra {
    rateLimit?: {
        resetTime: Date;
        remaining: number;
        limit: number;
    };
    roleId?: string;
    lang?: string;
    mobile?: string;
    roleLevel?: number;
}

export type roleType = 'agency' | 'agent' | 'admin';


export interface CountryResponse {
    id: string;
    name: string;
    code: string;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface StateResponse {
    id: string;
    name: string;
    code: string;
    countryId: string | object;
    createdAt: Date;
    updatedAt: Date;
}

export interface CityResponse {
    id: string;
    name: string;
    stateId: string | object;
    createdAt: Date;
    updatedAt: Date;
}



export interface CategoryResponse {
    id: string;
    name: string;
    parentId: string;
    isSub: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface LocationResponse {
    id: string;
    name: string;
    cityId: string;
    zipcodes: string[];
    createdAt: Date;
    updatedAt: Date;
}