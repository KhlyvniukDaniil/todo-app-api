export type UserResponse = Promise<Omit<User, 'password'>>
