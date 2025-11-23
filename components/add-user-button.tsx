// "use client"
// import React from 'react'
// import { Button } from './ui/button'
// import { createUser } from '@/server/user'


// function AddUserButton() {

//     const [loading, setLoading] = React.useState(false);
//   return (
//     <div>
//       <Button onClick={async ()=>{
//           setLoading(true);
//           await createUser();
//           setLoading(false);
//       }} className='max-w-sm' disabled={loading}>
//         {loading ? "Loading..." : "Add New User"}
//       </Button>
//     </div>
//   )
// }

// export default AddUserButton
"use client"
import React from 'react'
import { Button } from './ui/button'


function AddUserButton() {

    const [loading, setLoading] = React.useState(false);
  return (
    <div>
      <Button onClick={async ()=>{
          setLoading(true);
          setLoading(false);
      }} className='max-w-sm' disabled={loading}>
        {loading ? "Loading..." : "Add New User"}
      </Button>
    </div>
  )
}

export default AddUserButton
