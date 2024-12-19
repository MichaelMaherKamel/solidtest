import { For } from 'solid-js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { useI18n } from '~/contexts/i18n'
import { useLocation } from '@solidjs/router'

interface DataTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessorKey: keyof T
    cell?: (item: T) => any
    minWidth?: string
    maxWidth?: string
  }[]
}

export function DataTable<T>(props: DataTableProps<T>) {
  const { locale } = useI18n()
  const location = useLocation()
  const isAdminRoute = () => location.pathname.startsWith('/admin')
  const isRTL = !isAdminRoute() && locale() === 'ar'

  return (
    <div class='w-full overflow-auto' dir={isAdminRoute() ? 'ltr' : isRTL ? 'rtl' : 'ltr'}>
      <Table>
        <TableHeader>
          <TableRow>
            <For each={props.columns}>
              {(column) => (
                <TableHead
                  class='whitespace-nowrap px-4 py-3 text-start'
                  style={{
                    'min-width': column.minWidth,
                    'max-width': column.maxWidth,
                    width: column.maxWidth,
                  }}
                >
                  {column.header}
                </TableHead>
              )}
            </For>
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={props.data}>
            {(item) => (
              <TableRow>
                <For each={props.columns}>
                  {(column) => (
                    <TableCell
                      class='p-4 text-start'
                      style={{
                        'min-width': column.minWidth,
                        'max-width': column.maxWidth,
                        width: column.maxWidth,
                      }}
                    >
                      <div
                        class='flex items-center gap-4 justify-start overflow-hidden'
                        dir={isAdminRoute() ? 'ltr' : isRTL ? 'rtl' : 'ltr'}
                      >
                        {column.cell ? column.cell(item) : item[column.accessorKey]}
                      </div>
                    </TableCell>
                  )}
                </For>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    </div>
  )
}
