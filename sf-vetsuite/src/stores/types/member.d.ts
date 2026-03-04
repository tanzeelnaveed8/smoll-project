export interface Member {
  id: string
  name: string
  phone: string
  email: Nullable<string>
  isEmailVerified: boolean
  address: Nullable<string>
  villa: Nullable<string>
  city: Nullable<string>
  country: Nullable<string>
  postalCode: Nullable<string>
  timeZone: Nullable<string>
  createdAt: string
  updatedAt: string
}
