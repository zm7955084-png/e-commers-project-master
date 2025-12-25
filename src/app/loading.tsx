import { Loader } from 'lucide-react'
import React from 'react'

export default function Loading() {
  return<>
    <div className="min-h-screen flex items-center justify-center text-center">
        <h1><Loader size={30}/></h1>
    </div>

  </>
}
