import { Component, createSignal, createResource, Suspense, Show } from 'solid-js'
import { useAction, useSubmission } from '@solidjs/router'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { FiSearch, FiUsers } from 'solid-icons/fi'
import type { User } from '~/db/schema'
import { updateUserRoleAction, deleteUserAction } from '~/db/actions/users'
import { CustomDropdown } from '~/components/admin/customDropDown'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { DataTable } from '~/components/admin/dataTable'
import TableSkeleton from '~/components/admin/tableSkelton'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { useAdminContext } from '~/contexts/admin'
import { showToast } from '~/components/ui/toast'

const UserActions: Component<{ user: User }> = (props) => {
  const { refreshUsers } = useAdminContext()
  const [activeAction, setActiveAction] = createSignal<string | null>(null)
  const updateRole = useAction(updateUserRoleAction)
  const deleteUser = useAction(deleteUserAction)

  const updateSubmission = useSubmission(updateUserRoleAction)
  const deleteSubmission = useSubmission(deleteUserAction)

  const handleRoleUpdate = async (role: 'admin' | 'user' | 'seller') => {
    const formData = new FormData()
    formData.append('userId', props.user.id)
    formData.append('role', role)

    try {
      setActiveAction('update')
      await updateRole(formData)
      if (updateSubmission.result?.error) {
        throw new Error(updateSubmission.result.error)
      }
      refreshUsers() // Add refresh after successful update
      showToast({
        title: 'Success',
        description: 'User role updated successfully',
        variant: 'success',
      })
    } catch (error) {
      console.error('Action failed:', error)
      showToast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      })
    } finally {
      setActiveAction(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    const formData = new FormData()
    formData.append('userId', props.user.id)

    try {
      setActiveAction('delete')
      await deleteUser(formData)
      if (deleteSubmission.result?.error) {
        throw new Error(deleteSubmission.result.error)
      }
      refreshUsers() // Add refresh after successful deletion
      showToast({
        title: 'Success',
        description: 'User deleted successfully',
        variant: 'success',
      })
    } catch (error) {
      console.error('Action failed:', error)
      showToast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      })
    } finally {
      setActiveAction(null)
    }
  }

  const isLoading = () => {
    const action = activeAction()
    return Boolean(
      (action === 'update' && updateSubmission.pending) || (action === 'delete' && deleteSubmission.pending)
    )
  }

  const actions = [
    {
      label: 'Make Admin',
      onClick: () => handleRoleUpdate('admin'),
      disabled: props.user.role === 'admin',
    },
    {
      label: 'Make Seller',
      onClick: () => handleRoleUpdate('seller'),
      disabled: props.user.role === 'seller',
    },
    {
      label: 'Reset to User',
      onClick: () => handleRoleUpdate('user'),
      disabled: props.user.role === 'user',
    },
    {
      label: 'Delete User',
      onClick: handleDelete,
      className: 'text-red-600 hover:text-red-700 text-base', // Added text-base
    },
  ]

  return (
    <CustomDropdown actions={actions} isLoading={isLoading()} position='left' buttonVariant='ghost' buttonSize='icon' />
  )
}

const StatsCardSkeleton: Component = () => (
  <Card class='h-10 w-36 bg-primary/10'>
    <CardContent class='p-2 flex items-center justify-center gap-2'>
      <Skeleton class='w-4 h-4 rounded-full bg-primary/20' />
      <Skeleton class='h-4 w-14 bg-primary/20' />
    </CardContent>
  </Card>
)

const StatsCard = ({ count }: { count: number }) => (
  <Card class='h-10 bg-primary/10'>
    <CardContent class='p-2 flex items-center justify-center gap-2'>
      <FiUsers class='w-4 h-4 text-blue-600' />
      <span class='text-sm font-medium text-primary'>
        {count} user{count !== 1 ? 's' : ''}
      </span>
    </CardContent>
  </Card>
)

const UsersPage: Component = () => {
  const { users } = useAdminContext()
  const [search, setSearch] = createSignal('')

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name' as keyof User,
      cell: (item: User) => (
        <div class='flex items-center gap-2'>
          <Avatar>
            <AvatarImage src={item.image || ''} alt={item.name || 'User avatar'} />
            <AvatarFallback class='bg-gray-200'>{item.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div class='font-medium text-base'>{item.name || 'Unknown'}</div> {/* Added text-base */}
            <div class='text-sm text-muted-foreground'>{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role' as keyof User,
      cell: (item: User) => (
        <Badge
          variant={item.role === 'admin' ? 'error' : item.role === 'seller' ? 'warning' : 'secondary'}
          class='text-base'
        >
          {' '}
          {/* Added text-base */}
          {item.role}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'emailVerified' as keyof User,
      cell: (item: User) => (
        <Badge variant={item.emailVerified ? 'success' : 'secondary'} class='text-base'>
          {' '}
          {/* Added text-base */}
          {item.emailVerified ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id' as keyof User,
      cell: (item: User) => <UserActions user={item} />,
    },
  ]

  const filteredUsers = () => {
    const userData = users()
    if (!userData) return []

    const searchTerm = search().toLowerCase()
    return userData.filter(
      (user: User) =>
        user.name?.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    )
  }

  return (
    <>
      <div class='sticky top-0 bg-background z-10 border-b'>
        <div class='p-6'>
          <div class='flex items-center justify-between'>
            <div>
              <h1 class='text-2xl font-bold tracking-tight'>Users</h1>
              <p class='text-muted-foreground'>Manage system users and permissions</p>
            </div>
          </div>
        </div>
      </div>

      <div class='max-w-[1600px] w-full mx-auto'>
        <div class='container mx-auto p-6'>
          <div class='space-y-6'>
            <div class='flex items-center justify-between gap-4 mb-6'>
              <div class='relative flex-1 max-w-sm'>
                <FiSearch class='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search users...'
                  class='pl-8 no-zoom-input text-base' // Added no-zoom-input and text-base
                  value={search()}
                  onInput={(e) => setSearch(e.currentTarget.value)}
                />
              </div>
              <Suspense fallback={<StatsCardSkeleton />}>
                <Show when={users()}>
                  <StatsCard count={filteredUsers().length} />
                </Show>
              </Suspense>
            </div>

            <Suspense fallback={<TableSkeleton />}>
              <Show when={users()}>
                <div class='rounded-md border'>
                  <DataTable data={filteredUsers()} columns={columns} />
                </div>
              </Show>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default UsersPage
