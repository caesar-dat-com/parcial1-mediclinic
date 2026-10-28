// Context #2: las tareas. Envuelve el custom hook de Firestore y se apoya en el AuthContext
// para saber de que usuario son los datos. La lista, el detalle y el formulario leen de aqui.
import { createContext } from 'react';
import useTasksFirebase from '../hooks/useTasksFirebase';
import useAuth from '../hooks/useAuth';

export const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const { usuario } = useAuth();
  const valor = useTasksFirebase(usuario?.uid ?? null);
  return <TasksContext.Provider value={valor}>{children}</TasksContext.Provider>;
}
