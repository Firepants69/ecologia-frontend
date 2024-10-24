import React, { useEffect } from 'react'

function CambiosEtiquetas({changes}) {
    useEffect(()=>{},[changes])

    return (
    <div className='flex flex-col h-60 min-h-[30rem] w-[300px] bg-blue-300'>
    <div className='text-black bg-blue-200 min-h-[26rem]'>
        {changes.map((change)=>(
            <div key={change.id}>
                <h1>{change.type}</h1>
                <h1>{change.name}</h1>
                <h1>{change.rating}</h1>

            </div>
        ))}
    </div> 
    <button className=' mt-auto bg-blue-500 text-black px-4 py-2'>Guardar</button>
    </div>

  )
}

export default CambiosEtiquetas