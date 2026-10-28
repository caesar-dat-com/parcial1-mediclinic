import { useContext } from 'react';
import { TasksContext } from '../contexts/TasksContext';

// Atajo para leer el context de tareas desde cualquier pagina o componente.
export default function useTasks() {
  const valor = useContext(TasksContext);
  if (!valor) throw new Error('useTasks se debe usar dentro de <TasksProvider>.');
  return valor;
}
