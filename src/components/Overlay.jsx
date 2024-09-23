
const Overlay = ({ children, animacion }) => {


  return (
    <>
      <div className=' fixed z-40 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
        <div className=' relative bg-gray-700 px-5 pb-7 pt-5 rounded flex flex-col justify-center items-center gap-5'>
          {/* Botón para cerrar */}
          <button onClick={animacion} className=' absolute top-2 right-2 text-white text-xl hover:opacity-70'>
            x
          </button>
          {children}
        </div>
      </div>

    </>
  )
}
export default Overlay