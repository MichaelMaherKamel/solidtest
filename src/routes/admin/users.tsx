import { DataTable } from '~/components/admin/dataTable'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { createSignal } from 'solid-js'
import { AiOutlinePlusCircle } from 'solid-icons/ai'
import { FiSearch } from 'solid-icons/fi'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'editor'
  status: 'active' | 'inactive'
  lastSeen: string
}

const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastSeen: '2024-03-07T10:00:00',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    lastSeen: '2024-03-07T09:30:00',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'editor',
    status: 'inactive',
    lastSeen: '2024-03-06T15:45:00',
  },
]

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
    cell: (user: User) => <Badge variant={user.role === 'admin' ? 'error' : 'secondary'}>{user.role}</Badge>,
  },
  {
    header: 'Status',
    accessorKey: 'status' as const,
    cell: (user: User) => <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>{user.status}</Badge>,
  },
  {
    header: 'Last Seen',
    accessorKey: 'lastSeen' as const,
    cell: (user: User) => new Date(user.lastSeen).toLocaleString(),
  },
]

export default function UsersPage() {
  const [search, setSearch] = createSignal('')

  const filteredUsers = () =>
    dummyUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(search().toLowerCase()) ||
        user.email.toLowerCase().includes(search().toLowerCase())
    )

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
            <Button>
              <AiOutlinePlusCircle class='mr-2 h-4 w-4' />
              Add User
            </Button>
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

            <DataTable data={filteredUsers()} columns={columns} />
          </div>
        </div>
      </div>
    </>
  )
}
