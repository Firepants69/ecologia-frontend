import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import Eliminar from './Eliminar'
import { useAuth } from '../AuthProvider'
import { Link } from 'react-router-dom'
import EditarPunto from './location/EditarPunto'

function TarjetaPuntos({ index ,nombre, coordenadas, imagen}) {

 

  const [esActivoOverlay, setEsActivoOverlay] = useState(false)

  const [isEditActive,setIsEditActive] = useState(false)

  const {setLocationInformation,locationInformation} = useAuth()


  const handleLocationInformation = () =>{
    	setLocationInformation({index:index,name:nombre,coordinates:coordenadas,image:imagen})
      console.log(locationInformation) 
  } 

  const openEditOverlay = () =>{
    handleLocationInformation()
    setIsEditActive(true)
  }

  const closeEditOverlay = () =>{
    setIsEditActive(false)
  }

  const cerrarOverlayEliminar = () => {
    setEsActivoOverlay(false)
  }

  const abrirOverlayEliminar = () => {
    setEsActivoOverlay(true)
  }

  return (
    <div className="pt-5 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-col lg:flex-col xl:flex-col w-full md:max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <EditarPunto isActive={isEditActive} closeEdit={closeEditOverlay} ></EditarPunto>
      <Eliminar iconoInformacionSecundaria={faLocationDot} objetoEliminar={"Punto"} cerrarOverlay={cerrarOverlayEliminar} esActiva={esActivoOverlay} proyecto={{ informacionPrimaria: nombre, informacionSecundaria: coordenadas }}></Eliminar>
      <Link onClick={handleLocationInformation} to={`${nombre}/albumes`}>
        <img className="object-cover w-full rounded-t-lg h-64 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg lg:w-200" src={imagen} alt="" />
      </Link>
        <div className='flex items-center justify-center space-x-2 pt-6'>
          <button onClick={openEditOverlay}><FontAwesomeIcon className='text-2xl bg-gray-950 p-2 pl-6 pr-6 rounded-2xl' icon={faPen} /></button>
          <button onClick={abrirOverlayEliminar}><FontAwesomeIcon className='text-2xl bg-red-800 p-2 pr-6  pl-6 rounded-2xl' icon={faTrash} /> </button>
        </div>
      <div className="flex flex-col justify-between p-4 leading-normal md:text-lg">
        <h5 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{nombre}</h5>
        <div className='flex items-center space-x-2 mt-2 mb-4'>
          <FontAwesomeIcon className='h-5 w-5 mr-2' icon={faLocationDot} />
          <p className="font-normal text-gray-700 dark:text-gray-400 text-center">{coordenadas}</p>
        </div>
      </div>
    </div>
  )
}

export default TarjetaPuntos
