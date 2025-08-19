import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Button, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AddTask } from '../AddTask';
import classes from './DragandDrop.module.css';

type ColumnKey = 'todo' | 'doing' | 'done';
interface Task {
  id: string;
  symbol: string;
  name: string;
}
type Columns = Record<ColumnKey, Task[]>;

const initialColumns: Columns = {
  todo: [
    { id: '1', symbol: 'C', name: 'Carbon' },
    { id: '2', symbol: 'N', name: 'Nitrogen' },
  ],
  doing: [{ id: '3', symbol: 'Y', name: 'Yttrium' }],
  done: [
    { id: '4', symbol: 'Ba', name: 'Barium' },
    { id: '5', symbol: 'Ce', name: 'Cerium' },
  ],
};

export const columnOrder: ColumnKey[] = ['todo', 'doing', 'done'];

export const columnNames: Record<ColumnKey, string> = {
  todo: 'Not started',
  doing: 'In progress',
  done: 'Done',
};

interface DndListProps {
  onSelectTask: (task: any) => void;
  onColumnsChange: (columns: any) => void;
}

export function DndList({ onSelectTask, onColumnsChange }: DndListProps) {
  const [columns, setColumns] = useState<Columns>(initialColumns);
  const [opened, { open, close }] = useDisclosure(false);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const src = source.droppableId as ColumnKey;
    const dst = destination.droppableId as ColumnKey;
    const sourceCol = [...columns[src]];
    const destCol = [...columns[dst]];
    const [moved] = sourceCol.splice(source.index, 1);

    let newColumns: Columns;
    if (src === dst) {
      sourceCol.splice(destination.index, 0, moved);
      newColumns = {
        ...columns,
        [src]: sourceCol,
      };
      notifications.show({
        title: 'Task reordered',
        message: `Task "${moved.name}" reordered in "${columnNames[src]}"`,
        color: 'blue',
      });
    } else {
      destCol.splice(destination.index, 0, moved);
      newColumns = {
        ...columns,
        [src]: sourceCol,
        [dst]: destCol,
      };
      notifications.show({
        title: 'Task moved',
        message: `Task "${moved.name}" moved to "${columnNames[dst]}"`,
        color: 'blue',
      });
    }
    setColumns(newColumns);
    if (onColumnsChange) onColumnsChange(newColumns);
  };

  const handleAddTask = (task: { name: string; symbol: string; column: ColumnKey }) => {
    setColumns((prev) => {
      const newColumns: Columns = {
        ...prev,
        [task.column]: [
          ...prev[task.column],
          { id: Date.now().toString(), name: task.name, symbol: task.symbol },
        ],
      };
      notifications.show({
        title: 'Task created',
        message: `Task "${task.name}" added to "${columnNames[task.column]}"`,
        color: 'teal',
      });
      return newColumns;
    });
  };

  return (
    <>
      <Group mb="md">
        <Button onClick={open}>Add Task</Button>
      </Group>
      <AddTask opened={opened} onClose={close} onAdd={handleAddTask} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: 'flex',
            gap: 'var(--mantine-spacing-xl)',
            width: '100%',
            height: '100%',
            alignItems: 'stretch',
            background: 'var(--mantine-color-body)',
            padding: 'var(--mantine-spacing-md)',
          }}
        >
          {columnOrder.map((colId: ColumnKey) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    borderRadius: 'var(--mantine-radius-md)',
                    padding: 'var(--mantine-spacing-md)',
                    minWidth: 0,
                    minHeight: 500,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background:
                      'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
                    boxSizing: 'border-box',
                    boxShadow: 'var(--mantine-shadow-md)',
                    border:
                      '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
                  }}
                >
                  <Text
                    fw={700}
                    mb="var(--mantine-spacing-sm)"
                    style={{
                      color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0))',
                    }}
                  >
                    {columnNames[colId]}
                  </Text>
                  {columns[colId].map((item: Task, idx: number) => (
                    <Draggable draggableId={item.id} index={idx} key={item.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={classes.item}
                          style={{
                            marginBottom: 'var(--mantine-spacing-sm)',
                            background: snapshot.isDragging
                              ? 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5))'
                              : 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))',
                            borderRadius: 'var(--mantine-radius-sm)',
                            boxShadow: 'var(--mantine-shadow-xs)',
                            padding: 'var(--mantine-spacing-md)',
                            color:
                              'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0))',
                            ...provided.draggableProps.style,
                          }}
                          onClick={() => onSelectTask && onSelectTask({ ...item, column: colId })}
                        >
                          <Text className={classes.symbol}>{item.symbol}</Text>
                          <Text>{item.name}</Text>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}