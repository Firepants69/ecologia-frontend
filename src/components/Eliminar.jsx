import React from 'react'
import Overlay from './Overlay'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash,faCalendar} from "@fortawesome/free-solid-svg-icons"


function Eliminar({esActiva,cerrarOverlay,proyecto}) {
    if(!esActiva) return null

    return (
    <Overlay>
        
        <FontAwesomeIcon className='text-2xl' icon={faTrash}/>
        <div className='max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl'>
          <p className='text-2xl font-bold flex items-center justify-center'>¿Deseas eliminar este proyecto?</p>
          <div  className=' p-4 flex flex-col items-center justify-center '>
                <div className='group flex items-center space-x-2 '>
                  <p className='break-all mb-2 text-2xl tracking-tight text-gray-200 text-gray-400 '>{proyecto.nombre}   </p>
                  
                </div >
                <div className='flex items-center  space-x-2 mt-2 mb-4 '>
                  <FontAwesomeIcon icon={faCalendar}  className="h-5 w-5  mr-2  "/>    
                  <p className=' font-normal text-gray-700 dark:text-gray-400 text-center '>{proyecto.fecha}</p>
                </div>
            </div>
        </div >
        <div>
          <button className='py-2 px-6 text-white bg-red-800 hover:opacity-70 rounded-2xl m-1 border-1 border-red-600'>Eliminar</button>
          <button className='py-2 px-6 text-gray-400 bg-gray-800 hover:opacity-70 rounded-2xl m-1 border-1 border-gray-200  mt-0' onClick={cerrarOverlay}>cancelar</button>
        </div>
    </Overlay>
  )
}

export default Eliminar