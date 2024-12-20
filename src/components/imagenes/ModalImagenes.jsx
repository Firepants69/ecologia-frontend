import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from '../../AuthProvider';
import prefixUrl from '../../helpers/ip';
import { useEffect, useState } from 'react';

function ModalImagenes({ closeModal, children }) {
  const { files, userData,imagesExist,setImagesExist, albumInformation, refreshProjects, setFiles } = useAuth()
  const token = userData.token
  const [status, setStatus] = useState('0 imagenes subidas')
  const [isUploading, setIsUploading] = useState(false)


  const handleUploadPicture = async () => {
    if (!files || files.length === 0) {
      console.error("No se seleccionó ningún archivo");
      return;
    }
  
    setIsUploading(true);
  
    for (const [index, file] of files.entries()) {
      const dateString = file.date ? new Date(file.date) : new Date();
      dateString.setMinutes(dateString.getMinutes() - dateString.getTimezoneOffset());
      const date = dateString.toISOString().slice(0, 10);
      console.log("día de la imagen", date);
  
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('album_id', albumInformation.index);
      formData.append('category_id', 1);
      formData.append('date', date);
  
      try {
        const response = await fetch(`${prefixUrl}pictures/upload_picture`, {
          method: 'POST',
          headers: { Authorization: token },
          body: formData,
        });
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
  
        if (data.message === "Image already exists") {
          setImagesExist(true);
        }
        if (data && data.status === 'success') {
          console.log(data.response);
          setStatus(`${index + 1} imágenes subidas`);
          refreshProjects();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    console.log("¿Existe la imagen?", imagesExist);
    setFiles([]);
    setIsUploading(false);
    closeModal();
  };

  return (
    <div>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-700 ">
        <div className="pt-6 relative w-full h-screen bg-gray-800">
          <div className="flex justify-between items-center p-4 border-b">
            <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
            <button
              onClick={closeModal}
              className=" text-3xl font-bold text-white hover:text-gray-500"
            >
              ×
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="h-[75vh] overflow-y-auto p-6">
            <div className='flex items-center justify-center flex-col gap-2'>
              {/* <label className='text-2xl'> fecha de las imagenes </label> */}
              {/* <input type="date"
                value={dateImages}
                onChange={(e) => setDateImages(e.target.value)}
                className='px-2 rounded-md bg-zinc-700 text-white text-2xl' /> */}
              {children}
            </div>
          </div>

          <div className="p-4 border-t flex justify-end gap-x-6">
            {isUploading ?
              <div className='mb-4 flex flex-row justify-center items-center gap-3'>
                <div className="loader-images "></div>
                <p className='text-3xl text-blue-200'>{status}</p>
              </div>
              :
              (<>
                <button
                  onClick={handleUploadPicture}
                  className="px-4 py-2 bg-sky-800 text-white rounded flex justify-center items-center gap-x-2 hover:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={files.length === 0}
                >
                  <FontAwesomeIcon icon={faUpload} />
                  <p>Subir</p>
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-50"
                >
                  Cerrar
                </button>
              </>)
            }

          </div>
        </div>
      </div>

    </div>
  );
}

export default ModalImagenes;
