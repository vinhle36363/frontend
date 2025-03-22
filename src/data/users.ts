export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
let users: User[] = [];

export const getUsers = (): User[] => {
  return users;
};

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const createUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = (id: string, user: Partial<User>): User | undefined => {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return undefined;

  users[index] = {
    ...users[index],
    ...user,
    updatedAt: new Date().toISOString(),
  };
  return users[index];
};

export const deleteUser = (id: string): boolean => {
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  return users.length < initialLength;
}; 