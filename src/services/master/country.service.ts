import { CountryModel, ICountry } from '../../model/master/country.model';
import { CountryResponse } from '../../types/common.types';

export class CountryService {
    static async createCountry(countryData: ICountry): Promise<CountryResponse> {
        const existingCountry = await CountryModel.findOne({ $or: [{ name: countryData.name }, { code: countryData.code }] });
        if (existingCountry) {
            throw new Error('Country name or code already exists');
        }
        const country = new CountryModel(countryData);
        await country.save();
        return CountryService.mapToResponse(country);
    }

    static async getCountry(id: string): Promise<CountryResponse> {
        const country = await CountryModel.findOne({ id });
        if (!country) {
            throw new Error('Country not found');
        }
        return CountryService.mapToResponse(country);
    }

    static async getAllCountries(): Promise<CountryResponse[]> {
        const countries = await CountryModel.find();
        return countries.map(CountryService.mapToResponse);
    }

    static async updateCountry(id: string, name?: string, code?: string): Promise<CountryResponse> {
        const country = await CountryModel.findOne({ id });
        if (!country) {
            throw new Error('Country not found');
        }
        if (name) country.name = name;
        if (code) country.code = code;
        await country.save();
        return CountryService.mapToResponse(country);
    }

    static async deleteCountry(id: string): Promise<void> {
        const country = await CountryModel.findOne({ id });
        if (!country) {
            throw new Error('Country not found');
        }
        await CountryModel.deleteOne({ id });
    }

    private static mapToResponse(country: ICountry): CountryResponse {
        return {
            id: country.id,
            name: country.name,
            code: country.code,
            currency: country.currency,
            createdAt: country.createdAt,
            updatedAt: country.updatedAt,
        };
    }
}