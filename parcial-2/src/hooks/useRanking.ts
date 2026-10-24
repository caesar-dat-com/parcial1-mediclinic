import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db, hayFirebase } from '../lib/firebase';
import { rankingCon, type FilaRanking, type Usuario } from '../lib/almacen';

/**
 * Top 5 por puntaje. Si Firestore está configurado trae los usuarios reales;
 * si no, compara al usuario contra los demás jugadores guardados localmente.
 */
export function useRanking(usuario: Usuario | null, misPuntos: number) {
  const [tabla, setTabla] = useState<FilaRanking[]>([]);
  const [desdeNube, setDesdeNube] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    const local = rankingCon(usuario, misPuntos);
    setTabla(local);

    if (!hayFirebase || !db) return;
    getDocs(query(collection(db, 'progresos'), orderBy('points', 'desc'), limit(5)))
      .then((snap) => {
        const filas: FilaRanking[] = snap.docs.map((d) => ({
          uid: d.id,
          email: (d.data().email as string) ?? 'sin correo',
          points: (d.data().points as number) ?? 0,
        }));
        if (filas.length) {
          setTabla(filas);
          setDesdeNube(true);
        }
      })
      .catch(() => setDesdeNube(false));
  }, [usuario, misPuntos]);

  const miPosicion = tabla.findIndex((f) => f.uid === usuario?.uid) + 1;

  return { tabla, miPosicion, desdeNube };
}
