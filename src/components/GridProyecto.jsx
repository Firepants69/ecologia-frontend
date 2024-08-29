import React from 'react'
import TarjetaDeproyecto from '../components/TarjetaDeproyecto'

function GridProyecto() {
    
    const imagen = "https://s3.abcstatics.com/abc/www/multimedia/espana/2024/08/27/incendio_20240827162958-R3i0wNdkbC83YsBPKdtBArN-1200x840@diario_abc.jpg"
    const nombre = "proyecto"
    const fecha = "12-08-2024"
    let imagenes = []
    
    for(let i = 0;i<30;i++){
      imagenes.push({imagen:imagen,fecha:fecha,nombre:nombre+" "+i,indice:i})
    }
    imagenes.push({imagen:imagen,fecha:fecha,nombre:"Proyectos aguascalientes"})
    imagenes.push({imagen:imagen,fecha:fecha,nombre:"robertotototoototoototottoottototoottototoototttototo"})
    imagenes.push({imagen:imagen,fecha:fecha,nombre:"robertotototoototoototottoottototoottototoototttototo"})
    imagenes.push({imagen:imagen,fecha:fecha,nombre:"robertotototoototoototo"})
    imagenes.push({imagen:imagen,fecha:fecha,nombre:"robertotototoototoototottoottototoottototoototttototo"})
    imagenes.push({imagen:imagen,fecha:fecha,nombre:"robertotototoototoototottoottototoottototoototttototo"})
    imagenes.push({imagen:imagen,fecha:fecha,nombre:"robertotototoototoototottoottototoottototoototttototo"})
    imagenes.push({imagen:imagen,fecha:fecha,nombre:"robertotototoototoototo"})
    imagenes.push({imagen:imagen,fecha:fecha,nombre:"robertotototoototoototottoottototoottototoototttototo"})
    imagenes.push({imagen:imagen,fecha:fecha,nombre:"robertotototoototoototo"})


    return (

      <>
      {
        imagenes.length >0? <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 bg-gradient-to-r from-gray-900 to-blue-gray-950 p-6'>
          {imagenes.map((x)=>(
          <TarjetaDeproyecto  key = {x.indice} LinkImagen={x.imagen} fecha={x.fecha} nombre={x.nombre}/>
        ))}
      </div>:
      <div className='flex justify-center content-center p-5 bg-gradient-to-r from-gray-900 to-blue-gray-950'>
        <div className=''>
        <p className = 'text-1xl text-gray-500'>-- No tienes Proyectos, comienza uno --</p>
        </div>

      </div>
      }
      </>

    )
}

export default GridProyecto