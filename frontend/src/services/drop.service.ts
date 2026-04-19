import api from './api'
import type { Drop, DropStatus } from '../types/drop.types'

interface DropsResponse {
  success: boolean
  data: Drop[]
}

interface DropResponse {
  success: boolean
  data: Drop
}

export const getDrops = (status?: DropStatus) =>
  api.get<DropsResponse>('/drops', { params: status ? { status } : {} })

export const getDropById = (id: string) =>
  api.get<DropResponse>(`/drops/${id}`)
