import { CityModel, ICity } from '../../model/master/city.model';
import { StateModel } from '../../model/master/state.model';
import { CityResponse } from '../../types/common.types';
import mongoose from 'mongoose';

export class CityService {
  static async createCity(name: string, stateId: string): Promise<CityResponse> {
    const state = await StateModel.findOne({ id: stateId });
    if (!state) {
      throw new Error('State not found');
    }
    const existingCity = await CityModel.findOne({ name, stateId: state._id });
    if (existingCity) {
      throw new Error('City name already exists in this state');
    }
    const city = await CityModel.create({
      name,
      stateId: state._id,
    });
    return CityService.mapToResponse(city);
  }

  static async getCity(id: string): Promise<CityResponse> {
    const city = await CityModel.findOne({ id }).populate('stateId', 'id name');
    if (!city) {
      throw new Error('City not found');
    }
    return CityService.mapToResponse(city);
  }

  static async getAllCities(stateId?: string): Promise<CityResponse[]> {
    const query = stateId ? { stateId: (await StateModel.findOne({ id: stateId }))?._id } : {};
    const cities = await CityModel.find(query).populate('stateId', 'id name');
    return cities.map(CityService.mapToResponse);
  }

  static async updateCity(id: string, name?: string): Promise<CityResponse> {
    const city = await CityModel.findOne({ id });
    if (!city) {
      throw new Error('City not found');
    }
    if (name) city.name = name;
    await city.save();
    return CityService.mapToResponse(city);
  }

  static async deleteCity(id: string): Promise<void> {
    const city = await CityModel.findOne({ id });
    if (!city) {
      throw new Error('City not found');
    }
    await CityModel.deleteOne({ id });
  }

  private static mapToResponse(city: ICity): CityResponse {
    return {
      id: city.id,
      name: city.name,
      stateId: (city.stateId as any).id || city.stateId.toString(),
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
    };
  }
}