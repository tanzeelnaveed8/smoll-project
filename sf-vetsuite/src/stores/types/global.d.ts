export interface UploadedFile {
  filename: string
  filesize: number
  mimetype: string
  url: string
}

export type Nullable<T> = T | null

export interface SendBirdExtendedBaseMessage extends BaseMessage {
  message: string
  sender: {
    userId: string
    nickname: string
    profileUrl: string
  }
  customType: string
  createdAt: number
  name?: string
  url?: string
}

export interface ServicePayload {
  id: string
  label: CaseQuoteLabel.CONTINGENT | CaseQuoteLabel.ESSENTIAL | CaseQuoteLabel.RECOMMENDED
}

export interface Service {
currency:string 
description:string 
id:number
price:number
quickBooking:boolean
title: string 
type: string 
}