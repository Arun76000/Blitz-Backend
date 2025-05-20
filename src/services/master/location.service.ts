import { LocationModel, ILocation } from '../../model/master/location.model';
import { CityModel } from '../../model/master/city.model';
import { LocationResponse } from '../../types/common.types';
import mongoose from 'mongoose';

export class LocationService {
  static async createLocation(name: string, cityId: string): Promise<LocationResponse> {
    const city = await CityModel.findOne({ id: cityId });
    if (!city) {
      throw new Error('City not found');
    }
    const existingLocation = await LocationModel.findOne({ name, cityId: city._id });
    if (existingLocation) {
      throw new Error('Location name already exists in this city');
    }
    const location = await LocationModel.create({
      name,
      cityId: city._id,
    });
    return LocationService.mapToResponse(location);
  }

  static async getLocation(id: string): Promise<LocationResponse> {
    const location = await LocationModel.findOne({ id }).populate('cityId', 'id name');
    if (!location) {
      throw new Error('Location not found');
    }
    return LocationService.mapToResponse(location);
  }

  static async getAllLocations(cityId?: string): Promise<LocationResponse[]> {
    const query = cityId ? { cityId: (await CityModel.findOne({ id: cityId }))?._id } : {};
    const locations = await LocationModel.find(query).populate('cityId', 'id name');
    return locations.map(LocationService.mapToResponse);
  }

  static async updateLocation(id: string, name?: string): Promise<LocationResponse> {
    const location = await LocationModel.findOne({ id });
    if (!location) {
      throw new Error('Location not found');
    }
    if (name) location.name = name;
    await location.save();
    return LocationService.mapToResponse(location);
  }

  static async deleteLocation(id: string): Promise<void> {
    const location = await LocationModel.findOne({ id });
    if (!location) {
      throw new Error('Location not found');
    }
    await LocationModel.deleteOne({ id });
  }

  private static mapToResponse(location: ILocation): LocationResponse {
    return {
      id: location.id,
      name: location.name,
      cityId: (location.cityId as any).id || location.cityId.toString(),
      zipcodes: location.zipcodes,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt,
    };
  }
}