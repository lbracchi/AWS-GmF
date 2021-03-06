import axios, { AxiosResponse } from "axios";

import store from "../store";
import {
  FindPayload,
  PackDeliveryPayload,
  PackPayload,
  Pack,
  Food,
} from "../types/types";

export default {
  async createPack(payload: PackPayload): Promise<AxiosResponse<Pack>> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/pack/add`, payload, {
      headers: store.getters.getSessionHeader,
    });
  },

  async packList(payload: FindPayload): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/pack/find`, payload, {
      headers: store.getters.getSessionHeader,
    });
  },

  async packListExpanded(payload: {
    _id: string;
  }): Promise<AxiosResponse<Pack>> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/pack/find-expanded`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async filterPackList(
    payload: FindPayload
  ): Promise<AxiosResponse<{ packs: Pack[]; foods: Food[] }>> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/pack/filter`,
      payload,
      {
        headers: store.getters.getSessionHeader,
      }
    );
  },

  async editPack(payload: Pack): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/pack/edit`, payload, {
      headers: store.getters.getSessionHeader,
    });
  },

  async deletePack(payload: { id: string }): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/pack/delete`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async setDelivered(payload: { id: string }): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/pack/delivered`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async setPlannedDelivery(
    payload: PackDeliveryPayload
  ): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/pack/planned-delivery`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },
};
