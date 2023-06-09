import { type Unit } from './unit'

export interface Asset {
  id: string
  name: string
  description: string
  model: string // DECISION: Não criar uma interface para o Model pois não há muitas informações deste nesse momento. Mas caso seja necessário seria bom criar e fazer um relation aqui
  owner: string // DUVIDA: Esse Owner é um usuário do sistema?
  status: AssetsStatus // DECISION: Default is RUNNING
  healthLevel: number // DECISION: Default is 100%
  imageURL: string

  unit: Unit
}

export enum AssetsStatus {
  Running = 'Running',
  Alerting = 'Alerting',
  Stopped = 'Stopped'
}

export interface AssetModelResponse {
  id: string
  name: string
  description: string
  model: string
  owner: string
  imageURL?: string
  status: AssetsStatus
  healthLevel: number
  unitName: string
  companyId: string
}
