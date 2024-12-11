import { createAsync, useAction, useSubmission } from '@solidjs/router'
import { Component, createSignal, Suspense } from 'solid-js'
import { DataTable } from '~/components/admin/dataTable'
import TableSkeleton from '~/components/admin/tableSkelton'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { BiRegularDotsVerticalRounded } from 'solid-icons/bi'
import { FiSearch } from 'solid-icons/fi'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import type { User } from '~/db/schema'
import { getUsers } from '~/db/fetchers/users'
import { updateUserRoleAction, deleteUserAction } from '~/db/actions/users'

export const route = {
  preload: () => getUsers(),
}

const UsersPage: Component = () => {
  const [search, setSearch] = createSignal('')
  const users = createAsync(() => getUsers())

  const UserActions: Component<{ user: User }> = (props) => {
    const [isOpen, setIsOpen] = createSignal(false)
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
        setIsOpen(false)
        await updateRole(formData)

        if (updateSubmission.result?.error) {
          throw new Error(updateSubmission.result.error)
        }
      } catch (error) {
        console.error('Action failed:', error)
        alert('Failed to update user role. Please try again.')
      } finally {
        setActiveAction(null)
      }
    }

    const handleDelete = async () => {
      const formData = new FormData()
      formData.append('userId', props.user.id)

      try {
        setActiveAction('delete')
        setIsOpen(false)
        await deleteUser(formData)

        if (deleteSubmission.result?.error) {
          throw new Error(deleteSubmission.result.error)
        }
      } catch (error) {
        console.error('Action failed:', error)
        alert('Failed to delete user. Please try again.')
      } finally {
        setActiveAction(null)
      }
    }

    const isLoading = () => {
      const action = activeAction()
      return (action === 'update' && updateSubmission.pending) || (action === 'delete' && deleteSubmission.pending)
    }

    return (
      <DropdownMenu open={isOpen()} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger>
          <Button variant='ghost' size='icon' disabled={isLoading()}>
            {isLoading() ? <BiRegularDotsVerticalRounded class='animate-spin' /> : <BiRegularDotsVerticalRounded />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled={isLoading()} onSelect={() => handleRoleUpdate('admin')}>
            Make Admin
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isLoading()} onSelect={() => handleRoleUpdate('seller')}>
            Make Seller
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isLoading()} onSelect={() => handleRoleUpdate('user')}>
            Reset to User
          </DropdownMenuItem>
          <DropdownMenuItem class='text-red-600' disabled={isLoading()} onSelect={handleDelete}>
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name' as const,
    },
    {
      header: 'Email',
      accessorKey: 'email' as const,
    },
    {
      header: 'Role',
      accessorKey: 'role' as const,
      cell: (user: User) => (
        <Badge variant={user.role === 'admin' ? 'error' : user.role === 'seller' ? 'warning' : 'secondary'}>
          {user.role}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'emailVerified' as const,
      cell: (user: User) => (
        <Badge variant={user.emailVerified ? 'success' : 'secondary'}>
          {user.emailVerified ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id' as const,
      cell: (user: User) => <UserActions user={user} />,
    },
  ]

  const filteredUsers = () => {
    const userData = users()
    if (!userData) return []

    return userData.filter(
      (user: User) =>
        user.name?.toLowerCase().includes(search().toLowerCase()) ||
        user.email.toLowerCase().includes(search().toLowerCase())
    )
  }

  return (
    <>
      {/* Fixed Header */}
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

      {/* Content */}
      <div class='max-w-[1600px] w-full mx-auto'>
        <div class='container mx-auto p-6'>
          <div class='space-y-4'>
            <div class='flex items-center justify-between'>
              <div class='relative w-64'>
                <FiSearch class='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search users...'
                  class='pl-8'
                  value={search()}
                  onInput={(e) => setSearch(e.currentTarget.value)}
                />
              </div>
            </div>

            <Suspense fallback={<TableSkeleton />}>
              <DataTable data={filteredUsers()} columns={columns} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default UsersPage
