import type { Participant } from '@/types.ts'

const API_URL = 'https://api.escuelajs.co/api/v1/users'

export async function getUsers(): Promise<Participant[]> {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  const data = await res.json()

  return data.map((user: never) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password || '',
    role: user.role,
    avatar: user.avatar,
  }))
}

export async function getUserById(id: number): Promise<Participant> {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch user')
  }
  return await res.json()
}

export async function createUser(user: Omit<Participant, 'id'>): Promise<Participant> {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error("No authentication token found")
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(user)
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to create user")
  }

  return await res.json()
}

export async function updateUser(id: number, user: Omit<Participant, 'id'>): Promise<Participant> {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    if (res.ok) {
      const updatedUser = await res.json()
      updateLocalStorage(updatedUser)
      return updatedUser
    }
  } catch (error) {
    console.warn('Server update failed, updating locally:', error)
  }

  const updatedUser: Participant = { id, ...user }
  updateLocalStorage(updatedUser)
  return updatedUser
}

function updateLocalStorage(updatedUser: Participant) {
  const currentUsers = JSON.parse(localStorage.getItem('participants') || '[]')
  const updatedUsers = currentUsers.map((u: Participant) =>
    u.id === updatedUser.id ? updatedUser : u
  )
  localStorage.setItem('participants', JSON.stringify(updatedUsers))
}

export async function deleteUser(id: number): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      console.warn('Server delete failed, deleting locally')
    }
  } catch (error) {
    console.warn('Server delete error, deleting locally:', error)
  }

  const currentUsers = JSON.parse(localStorage.getItem('participants') || '[]')
  const updatedUsers = currentUsers.filter((u: Participant) => u.id !== id)
  localStorage.setItem('participants', JSON.stringify(updatedUsers))
}

export const login = async (email: string, password: string): Promise<{ access_token: string }> => {
  const res = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Login failed' }))
    throw new Error(error.message || 'Invalid credentials')
  }

  const data = await res.json()

  localStorage.setItem('token', data.access_token)

  return data
}

export const logout = (): void => {
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('storage'))
}
