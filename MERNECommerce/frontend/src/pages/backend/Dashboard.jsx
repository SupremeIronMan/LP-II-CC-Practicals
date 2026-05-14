import React from 'react'
import Backend from '../../layout/Backend'

function Dashboard() {
  return (
     <>
     <Backend>
        <h2 className="text-2xl font-semibold mb-4">Welcome to Dashboard</h2>

          {/* Example content */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 shadow rounded">Category Section</div>
            <div className="bg-white p-4 shadow rounded">Product Section</div>
          </div>
     </Backend>
     </>
  )
}

export default Dashboard