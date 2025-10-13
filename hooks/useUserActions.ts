import { User, UserRegistrationRequest, UserUpdateRequest } from '@/types'
import { userService } from '@/services/api'
import { useState } from 'react'
import { useUsers } from '@/contexts/UserContext'
import { HTTP_STATUS } from '@/services/constants'
import { useError } from '@/contexts/ErrorContext'


export const useUserActions = () => {
  const [loading, setLoading] = useState(false)
  const { addUser, editUser, removeUser } = useUsers()
  const { handleApiError } = useError()


  const createUser = async (userData: UserRegistrationRequest) => {
    try {
      const response = await userService.register(userData)
      if (response.success && response.data) {
        addUser(response.data)
      }
      throw new Error('Failed to create user')
    }
    catch (error: any) {
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error) // ✅ Auto-route to appropriate error screen
      }
    }
  }

  const updateUser = async (id: string, updates: UserUpdateRequest): Promise<void> => {
    try {
      setLoading(true)

      const response = await userService.updateUser(id, updates)

      if (response.success && response.data) {
        const updatedUser: User = {
          id: response.data.id,
          email: response.data.email, 
          name: response.data.name,
          role: response.data.role,
          password: '', // Not provided by API for security
          emailVerified: true,
          recoverMode: false,
          location: {
            latitude: 0,
            longitude: 0
          },
          createdAt: new Date(response.data.createdAt || Date.now()).toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: response.data.isActive,
        }

        // Update local state
        editUser(updatedUser)
      } else {
        throw new Error(response.message || 'Failed to update user')
      }
    } catch (error: any) {
      console.error('Failed to update user:', error)

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error) // ✅ Auto-route to appropriate error screen
      }
    } finally {
      setLoading(false)
    }
  }

  const activateUser = async (id: string): Promise<void> => {
    try {
      setLoading(true)
      const response = await userService.activateUser(id)

      if (response.success && response.data) {
        editUser(response.data)
      } else {
        throw new Error(response.message || 'Failed to activate user')
      }
    } catch (error: any) {
      console.error('Failed to activate user:', error)

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error) // ✅ Auto-route to appropriate error screen
      } else {
      }
    } finally {
      setLoading(false)
    }
  }

  const deactivateUser = async (id: string): Promise<void> => {
    try {
      setLoading(true)

      const response = await userService.deactivateUser(id)

      if (response.success && response.data) {
        editUser(response.data)
      } else {
        throw new Error(response.message || 'Failed to deactivate user')
      }
    } catch (error: any) {
      console.error('Failed to deactivate user:', error)

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error) // ✅ Auto-route to appropriate error screen
      } else {
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: string): Promise<void> => {
    try {
      setLoading(true)

      const response = await userService.deleteUser(id)

      if (response.success && response.data) {
        removeUser(response.data)
      } else {
        throw new Error(response.message || 'Failed to delete user')
      }
    } catch (error: any) {
      console.error('Failed to delete user:', error)

      // ✅ Check if it's a network/server error that needs routing
      if (error?.status >= HTTP_STATUS.NETWORK_ERROR) {
        handleApiError(error) // ✅ Auto-route to appropriate error screen
      } else {
      }
    } finally {
      setLoading(false)
    }
  }




  return {
    createUser,
    updateUser,
    deleteUser,
    deactivateUser,
    activateUser,
    loading
  }
}
