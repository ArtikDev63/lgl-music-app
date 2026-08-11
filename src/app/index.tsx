// app/index.tsx
import { Redirect } from 'expo-router';

export default function RootIndex() {
  // Al retornar la redirección pero sin envoltorios visuales, disminuye el tiempo de espera
  return <Redirect href="/songs" />; 
}
