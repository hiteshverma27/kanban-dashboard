import { useState } from 'react';
import { AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DndList } from '../DragandDrop/DragandDrop';
import { HeaderSearch } from '../Header/Header';
import { NavbarSearch } from '../Navbar/Navbar';

export function BasicAppShell() {
  const columnNames: Record<string, string> = {
    todo: 'Not started',
    doing: 'In progress',
    done: 'Done',
  };
  const [opened, { toggle }] = useDisclosure();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [asideOpened, setAsideOpened] = useState(false);

  const handleSelectTask = (task: any) => {
    setSelectedTask(task);
    setAsideOpened(true);
  };

  const handleColumnsChange = (columns: any) => {
    if (selectedTask) {
      for (const col of Object.keys(columns)) {
        const found = columns[col].find((t: any) => t.id === selectedTask.id);
        if (found) {
          if (selectedTask.column !== col) {
            notifications.show({
              title: 'Task moved',
              message: `Task "${selectedTask.name}" moved to "${columnNames[col]}"`,
              color: 'blue',
            });
          }
          setSelectedTask({ ...found, column: col });
          return;
        }
      }
      setSelectedTask(null);
      setAsideOpened(false);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      aside={{
        width: 500,
        breakpoint: 'md',
        collapsed: { desktop: !asideOpened, mobile: !asideOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <HeaderSearch />
      </AppShell.Header>
      <AppShell.Navbar>
        <NavbarSearch />
      </AppShell.Navbar>
      <AppShell.Aside p="md">
        {selectedTask ? (
          <div>
            <h3>Task Details</h3>
            <p>
              <b>Name:</b> {selectedTask.name}
            </p>
            <p>
              <b>Symbol:</b> {selectedTask.symbol}
            </p>
            <p>
              <b>Column:</b> {columnNames[selectedTask.column]}
            </p>
            <button onClick={() => setAsideOpened(false)}>Close</button>
          </div>
        ) : (
          <>Select a Task for details</>
        )}
      </AppShell.Aside>
      <AppShell.Main>
        <DndList onSelectTask={handleSelectTask} onColumnsChange={handleColumnsChange} />
      </AppShell.Main>
    </AppShell>
  );
}