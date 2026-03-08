export interface UploadedFile {
  filename: string
  filesize: number
  mimetype: string
  url: string
}

export interface Service {
  id: string
  title: string
  description: string
  price: number
  currency: string
}

export type Nullable<T> = T | null

export type Period = 'monthly' | 'weekly'