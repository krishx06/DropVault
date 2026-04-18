export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
}

export interface Seller {
  id: string
  user?: User
}
