import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { For } from 'solid-js'

interface DataTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessorKey: keyof T
    cell?: (item: T) => any
  }[]
}

export function DataTable<T>(props: DataTableProps<T>) {
  return (
    <div class='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <For each={props.columns}>{(column) => <TableHead>{column.header}</TableHead>}</For>
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={props.data}>
            {(item) => (
              <TableRow>
                <For each={props.columns}>
                  {(column) => <TableCell>{column.cell ? column.cell(item) : item[column.accessorKey]}</TableCell>}
                </For>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    </div>
  )
}
