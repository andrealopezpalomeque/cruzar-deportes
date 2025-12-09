export type BoxType = 'basic' | 'premium' | 'deluxe'
export type EraPreference = 'retro' | 'current' | 'mixed'

export interface MysteryBoxConfig {
  size: string
  excludedTeams: string[]
  eraPreference: EraPreference
  boxType: BoxType
}

export interface BoxTypeOption {
  value: BoxType
  label: string
  description: string
  price: string
  pricePerItem: string
  jerseyCount: number
}

export interface TeamOrdersInquiry {
  contactName: string
  teamName: string
  approximateQuantity: number
  preferredModel?: string
  customizationNeeded: boolean
  additionalNotes?: string
}
