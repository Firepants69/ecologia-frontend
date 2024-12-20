import { useEffect, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../AuthProvider'
import GridImages from './GridImagenes'
import { Paginacion } from './Paginacion'
import FilterImagesDate from './FilterImagesDate'
import HandleFetchPictures from '../../helpers/HandleFetchPictures'
import ImagesLoader from '../Loaders/ImagesLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWarning } from '@fortawesome/free-solid-svg-icons'
import WarningComponent from './WarningComponent'

function ImagesMenu() {
  const { albumID, proyectoId, puntoID } = useParams()
  const {
    imagesExist,setImagesExist,
    setLoadingComplete, loadingComplete, shouldRefresh, filter, setImages, images, setIsTaggerActive,
    setCardImagePage, setImage, setMaxPage, setPageImage,
    pageImage, userData, quantityImagePerPage } = useAuth()
  const token = userData.token
  const [searchParams, setSearchParams] = useSearchParams()
  const [maxPageGrid, setMaxPageGrid] = useState(1)
  const location = useLocation()




  // const handleTagger = () => {

  //   const getData = async () => {

  //     let query = { ...filter }
  //     delete query.quantity
  //     delete query.page
  //     query = { ...query, quantity: 1, page: searchParams.get('image-page') }
  //     const data = await HandleFetchPictures(query)
  //     const newImages = data.filtered_pictures.map((picture) => ({
  //       link: picture.url,
  //       id: picture.id,
  //       date: picture.date,
  //       url_original: picture.url_original
  //     }))
  //     console.log("se muestra esto", data.total_pages)
  //     setImage(newImages[0])
  //     setCardImagePage(Number(searchParams.get('image-page')))
  //     setIsTaggerActive(true)
  //     setMaxPage(data.total_pages)
  //   }
  //   getData()
  // }



  const handleNext = () => {
    const newPage = Number(pageImage) + 1;
    // setSearchParams(params => {
    //   // params.set("page", newPage);
    //   return params;
    // });
    setPageImage(newPage); // Usa el nuevo número de página aquí
  }

  const handlePrevious = () => {
    const newPage = Number(pageImage) - 1;
    // setSearchParams(params => {
    //   params.set("page", newPage);
    //   return params;
    // });
    setPageImage(newPage); // Usa el nuevo número de página aquí
  }



  useEffect(() => {

    setLoadingComplete(false)
    // const currentPage = searchParams.get("page") || 1; // Usa un valor por defecto
    // // Actualiza los parámetros de búsqueda si es necesario
    // setSearchParams(params => {
    //   params.set("page", currentPage);
    //   return params;
    // });

    // setPageImage(currentPage ? Number(currentPage) : 1)


    let query = { ...filter }
    if (location.pathname != "/imagenes") {
      delete query.projects
      delete query.locations
      delete query.albums
      query = { ...filter, page: pageImage, projects: proyectoId, locations: puntoID, albums: albumID }

    } else {
      query = { ...filter, page: pageImage }
    }
    const getData = async () => {
      const data = await HandleFetchPictures(query)
      console.log("datos datos datos", data)
      const newData = data.filtered_pictures.map((picture) => ({
        link: picture.url,
        id: picture.id,
        date: picture.date,
        url_original: picture.url_original
      }))
      setImages(newData)
      setMaxPageGrid(data.total_pages)
    }

    filter && getData()

    setTimeout(() => {
      images && setLoadingComplete(true)
    }, 600);

    console.log("esta chimoltrufiada", filter);

    // if (searchParams.get('is-active-tagger')) {
    //   handleTagger()
    // }
    return () => {
      setLoadingComplete(false);
    };

  }, [pageImage, maxPageGrid, filter, shouldRefresh])

  const areObjectsEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  useEffect(()=>{
    if(imagesExist){
      setTimeout(()=>{
        setImagesExist(false)
      },3200)
    }
  },[imagesExist])


  const isDefaultFilter = () => {

    return areObjectsEqual(filter, { quantity: quantityImagePerPage })
  }

  return (
    <div className=' flex flex-col justify-center items-center w-full'>
      
       <WarningComponent isActive={imagesExist}/>
      <section>
        {(images.length > 0 || (images.length === 0 && !isDefaultFilter())) ? <FilterImagesDate /> : ""}

      </section>
      {images.length > 0 && loadingComplete ? <GridImages images={images} /> :
        ""}

      {!loadingComplete ? <ImagesLoader /> : ""}

      {images.length === 0 && !isDefaultFilter() ?
        <div className='opacity-70 rounded-2xl bg-zinc-700 w-[65%] p-2 text-center'>
          Sin resultados.
        </div>
        : ""}

      {images.length > 0 ? <Paginacion handleNext={handleNext} handlePrevious={handlePrevious} maxPage={maxPageGrid} /> : ""}

    </div>
  )
}

export default ImagesMenu


