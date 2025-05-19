import { StateModel, IState } from '../../model/master/state.model';
import { CountryModel } from '../../model/master/country.model';
import { StateResponse } from '../../types/common.types';
import mongoose from 'mongoose';

export class StateService {
  static async createState(name: string, code: string, countryId: string): Promise<StateResponse> {
    const country = await CountryModel.findOne({ id: countryId });
    if (!country) {
      throw new Error('Country not found');
    }
    const existingState = await StateModel.findOne({ name, countryId: country._id });
    if (existingState) {
      throw new Error('State name already exists in this country');
    }
    const state = await StateModel.create({
      name,
      code,
      countryId: country._id,
    });
    return StateService.mapToResponse(state);
  }

  static async getState(id: string): Promise<StateResponse> {
    const state = await StateModel.findOne({ id }).populate('countryId', 'id name');
    if (!state) {
      throw new Error('State not found');
    }
    return StateService.mapToResponse(state);
  }

  static async getAllStates(countryId?: string): Promise<StateResponse[]> {
    const query = countryId ? { countryId: (await CountryModel.findOne({ id: countryId }))?._id } : {};
    const states = await StateModel.find(query).populate('countryId', 'id name');
    return states.map(StateService.mapToResponse);
  }

  static async updateState(id: string, name?: string, code?: string): Promise<StateResponse> {
    const state = await StateModel.findOne({ id });
    if (!state) {
      throw new Error('State not found');
    }
    if (name) state.name = name;
    if (code) state.code = code;
    await state.save();
    return StateService.mapToResponse(state);
  }

  static async deleteState(id: string): Promise<void> {
    const state = await StateModel.findOne({ id });
    if (!state) {
      throw new Error('State not found');
    }
    await StateModel.deleteOne({ id });
  }

  private static mapToResponse(state: IState): StateResponse {
    return {
      id: state.id,
      name: state.name,
      code: state.code,
      countryId: (state.countryId as any).id || state.countryId.toString(),
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
    };
  }
}