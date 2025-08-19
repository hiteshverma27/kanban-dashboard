import { useState } from 'react';
import { Button, Group, Modal, Select, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

type ColumnKey = 'todo' | 'doing' | 'done';

const columnOptions = [
  { value: 'todo', label: 'Not started' },
  { value: 'doing', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

interface AddTaskProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (task: { name: string; symbol: string; column: ColumnKey }) => void;
}

export function AddTask({ opened, onClose, onAdd }: AddTaskProps) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [column, setColumn] = useState<ColumnKey>('todo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !symbol.trim()) return;
    onAdd({ name, symbol, column });
    setName('');
    setSymbol('');
    setColumn('todo');
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Task"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Task Name"
          placeholder="Enter task name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
          mb="md"
          data-autofocus
        />
        <TextInput
          label="Symbol"
          placeholder="E.g. C"
          value={symbol}
          onChange={(e) => setSymbol(e.currentTarget.value)}
          required
          mb="md"
        />
        <Select
          label="Column"
          data={columnOptions}
          value={column}
          onChange={(v) => setColumn(v as ColumnKey)}
          required
          mb="md"
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">Add</Button>
        </Group>
      </form>
    </Modal>
  );
}