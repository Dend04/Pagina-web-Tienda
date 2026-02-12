'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState('Probando conexión...')
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/test-db')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus(data.message)
          setCount(data.count)
        } else {
          setStatus(`❌ Error: ${data.error}`)
        }
      })
      .catch(err => setStatus(`❌ Error de red: ${err.message}`))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Conexión Supabase</h1>
      <p className="mb-2">{status}</p>
      {count !== null && (
        <p className="text-green-600">
          ✅ Total de productos: {count}
        </p>
      )}
    </div>
  )
}