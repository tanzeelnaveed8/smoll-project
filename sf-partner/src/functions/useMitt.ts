import type { Service } from '@/stores/types/services'
import type { Veterinarians } from '@/stores/types/vet'
import mitt from 'mitt'

type Events = {
  'manage-service-drawer:update_servcie': { payload: Service }
  'manage-service-drawer:delete_servcie': { id: string }
  'profile-details-drawer:delete_vet': { id: string }
  'manage-service-drawer:update_vet': { payload: Veterinarians }
  'quotation-drawer:refetch_cases': any
  'case-details-drawer:refetch_appointments': any
  'case-details-drawer:refetch_upcoming-appointments': any
  'refetch_services':any
}

const emitter = mitt<Events>()

const useMitt = () => {
  return {
    emitter
  }
}

export default useMitt
