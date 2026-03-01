'use client'

import { useQuery } from '@tanstack/react-query'

export default function TestPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['testDb'],
    queryFn: async () => {
      const res = await fetch('/api/test-db')
      if (!res.ok) throw new Error('Error en la petición')
      return res.json()
    },
  })

  if (isLoading) return <div className="p-8">Cargando...</div>
  if (error) return <div className="p-8">❌ Error: {error.message}</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Conexión Supabase</h1>
      <p className="mb-2">{data.message}</p>
      {data.count !== undefined && (
        <p className="text-green-600">
          ✅ Total de productos: {data.count}
        </p>
      )}
    </div>
  )
}