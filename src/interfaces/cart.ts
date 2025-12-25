import { productI } from "./product"

export interface CartResponse {
  status: string
  numOfCartItems: number
  cartId: string
  data: Data
  message?: string
}

export interface Data {
  _id: string
  cartOwner: string
  products: Item[]
  createdAt: string
  updatedAt: string
  __v: number
  totalCartPrice: number
}

export interface Item {
  count: number
  _id: string
  product: productI
  price: number
}


