import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { UploadedFile } from './types/global'

export interface Partner {
  id: string
  name: string
  clinicImg: UploadedFile
  country: string
  city: string
  address: string
  vets:{id:string,name:string}[]
}

interface State {
  specialities: { id: number; name: string }[] | null
}

export const usePartnerStore = defineStore('PartnerStore', {
  state: (): State => ({
    specialities: null
  }),
  actions: {
    async fetchPartner(
      quickList:boolean,
      search?: string,
      specaialities?: string[],
      filter?: { city: string | null; country: string | null },
    ) {
      const partners = await api.get('/vet/partners', {
        params: {
          quickList,
          search: search,
          specialities: specaialities,
          city: filter?.city,
          country: filter?.country,
          limit: 30
        }
      })
      return partners.data
    },
    async fetchSpecaialities() {
      const specaialities = await api.get('vet/partners/specialities')
      this.specialities = specaialities.data
    },
    async fetchServices(partnerId:string,isQuicklist:boolean){
      const services = await api.get(`/vet/partners/${partnerId}/services`,{
        params:{
          quickList:isQuicklist
        }
      })
      return services.data
    },
    async fetchPartnerVetAvailibility(partnerId:string, vetId:string,date?:string){
      const availability = await api.get(`/vet/partners/${partnerId}/vets/${vetId}/availabilities`,{
        params:{
          date:date
        }
      })
      return availability.data
    }
  }
})
