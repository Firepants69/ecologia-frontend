import { useAuth } from "../../AuthProvider"
import { useEffect, useState } from "react";
import prefixUrl from "../../helpers/ip";
import ModalIMagen from "./ModalIMagen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faGreaterThan, faLessThan,faCheck } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";
import handleGetData from "../../helpers/handleGetData";
import handleGet from "../../helpers/handleGet";
import CambiosEtiquetas from "../etiqueta/CambiosEtiquetas";
import { motion,AnimatePresence } from 'framer-motion';


export const Etiquetador = ({ isActive, handleClose }) => {

    const navigate = useNavigate()
    const { changes,setChanges,cardImagePage, setCardImagePage, setImage, image, userData, albumInformation } = useAuth()
    const token = userData.token
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [isModalActive, setIsModalActive] = useState(false)
    const [tagsSelected, setTagsSelected] = useState([])
    const [isNextPage, setIsNextPage] = useState(true)
    const [categorySelected, setCategorySelected] = useState(null)
    const [maxPage, setMaxPage] = useState(1)
    const userName = userData.userName
    const userID = userData.decoded.user_id

    useEffect(() => {
        document.body.className = ' bg-gradient-to-r from-gray-900 to-blue-gray-950';


        // conseguir el numero de la ultima pagina 
        const endPointPage = `pictures/show_picture_from_album?page=${cardImagePage}&quantity=${1}&album_id=${albumInformation.index}`
        handleGetData(endPointPage, token).then((data) => {
            setMaxPage(data.total_pages)
            handleIsNextPage()
        })

        const endPointCategories = `pictures/show_categories?page=${1}}&quantity=${100}`

        //obtener categorias
        handleGetData(endPointCategories, token).then(
            (data) => {
                if (data && data.status == 'success') {
                    let newFields = []
                    data.response.forEach(category => {
                        if (category[0] != 1) {
                            newFields.push({ field: category[1], id: category[0] })
                        }
                    });
                    setCategories(newFields)
                    handleTags(newFields[0].id)
                }
            }
        ).catch((error) => console.error(error))



    }, [cardImagePage,categorySelected,image]);


    const handleClick = () => {
        // Aquí puedes realizar alguna lógica antes de redirigir
        navigate('../categoria-etiqueta');
    };

    const handleNext = () => {
        const endPoint = `pictures/show_picture_from_album?page=${cardImagePage + 1}&quantity=${1}&album_id=${albumInformation.index}`

        handleGetData(endPoint, token).then((data) => {
            if (data && data.status == 'success') {
                const newImages = data.response.map((response) => (
                    {
                        link: response[0],
                        id: response[1],
                        date: response[2],
                    }
                ))
                setImage(newImages[0])
                setCardImagePage((CardImagePage) => CardImagePage + 1)
                handleIsNextPage(2)
                setChanges([])

            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const handleIsNextPage = () => {
        if (cardImagePage < maxPage) {
            setIsNextPage(true)
        } else {
            setIsNextPage(false)
        }
    }

    const handlePrevious = async () => {
        const endPoint = `pictures/show_picture_from_album?page=${cardImagePage - 1}&quantity=${1}&album_id=${albumInformation.index}`
        let data = [image]
        try {
            data = await handleGet(endPoint, token)
        } catch (error) {
            console.error(error)
        }
        const newImages = data.map((response) => (
            {
                link: response[0],
                id: response[1],
                date: response[2],
            }
        ))
        handleIsNextPage(0)
        setImage(newImages[0])
        setCardImagePage(cardImagePage => cardImagePage - 1)
        setChanges([])
    }

    const handleSelect = (e, tag) => {
        e.preventDefault()
        setTagsSelected(tagsSelected => [...tagsSelected, tag.idTag])
        let newTags = []
        tags.forEach((tagEach) => {
            if (tagEach === tag) {
                    newTags.push({
                        ...tag,
                        isSelect: !tag.isSelect,
                    })
                console.log(tag)   
                if(tagEach.isSelect){
                    updateCreateDeselect(tagEach)
                }if(tagEach.oldRating == undefined && !tagEach.isSelect) {
                    setChanges((changes) =>[...changes,{type:"create",idTag:tag.idTag,name:tag.name,rating:tag.rating,categorySelected,id:`${tag.idTag}1`}])
                }if(tagEach.oldRating != undefined){
                    const exists = changes.some((change)=> change.idTag === tag.idTag)
                    if(exists){
                        updateCreateDeselect(tag)              
                    }else{
                        setChanges((changes) =>[...changes,{type:"delete",idTag:tag.idTag,name:tag.name,rating:tag.rating,categorySelected,id:`${tag.idTag}3`}])
                    }
                }
            } else {
                newTags.push(tagEach)
            }
        })
        setTags(newTags)
        const newTagsSelected = []
        newTags.forEach((newTag) => {
            if (newTag.isSelect) {
                newTagsSelected.push(newTag.idTag)
            }
        })
        setTagsSelected(newTagsSelected)
    }

    const updateCreateDeselect = (tag)=>{
        setChanges((changes)=>{
            let newChanges = []
            changes.forEach((change)=>{
                if(change.idTag !==tag.idTag ){
                    newChanges.push(change)
                }
            })
            return newChanges 
        })
    }

    

    const handleCloseModal = () => {
        setIsModalActive(false)
    }

    const handleOpenModal = () => {
        setIsModalActive(true)
    }

    const onLabel = (e) => {
        e.stopPropagation()
        e.preventDefault()
        console.log("hola")
    }

    

    const handleRatingChange = (e, tagIndex) => {
        const newTags = tags.map((tag, index) => {
            const updatedRating = Number(e.target.value); // Convertir el valor a número
            if (index === tagIndex) {
                return {
                    ...tag,
                    rating: updatedRating,
                };
            }
            return tag;
        });

        if(newTags[tagIndex].oldRating != undefined){
            handleUpdateRatingChage(tagIndex,newTags)
        }else{
            updateCreateRating(tagIndex,newTags)
        }
        setTags(newTags)
    };

    const handleUpdateRatingChage = (index,newTags) => {
        if(Number(newTags[index].oldRating) === Number(newTags[index].rating)){
            let newChanges = []
            changes.forEach((change)=>{
                if(change.id !== `${newTags[index].idTag}2`){
                    newChanges.push(change)
                }
            })
            setChanges(newChanges)
            return 
        }
        const existsRecord = changes.some((change)=> change.id === `${newTags[index].idTag}2`)
        if(existsRecord){
            const newChanges = changes.map((change)=>(
                change.id === `${newTags[index].idTag}2` ? {...change,rating:newTags[index].rating} : change
            ))
            
            setChanges(newChanges)
        }else{
            setChanges((changes)=> [...changes,{type:"update",idTag:newTags[index].idTag,name:newTags[index].name,rating:newTags[index].rating,categorySelected,id:`${newTags[index].idTag}2`}])
        }
    }

    const updateCreateRating = (index,newTags)=>{
            let newChanges = []
            changes.forEach((change)=>{
                if(change.id === `${newTags[index].idTag}1`){
                    newChanges.push({type:"create",idTag:newTags[index].idTag,name:newTags[index].name,rating:newTags[index].rating,categorySelected,id:`${newTags[index].idTag}1`})
                }else{
                    newChanges.push(change)
                }
            })
            setChanges(newChanges)
    }




    const handleTags = async (id) => {
        
        try {
            let newTags = [];
            
            // Obtener etiquetas (tags) sin calificación
            const dataTags = await handleGetData(`pictures/show_tags?category_id=${id}`, token);
            newTags = dataTags.response.map((informacion) => ({
                name: informacion[1],
                idTag: informacion[0],
                isSelect: false,
                rating: 0,
                oldRating:undefined
            }));
    
            // Obtener etiquetas con calificación
            const dataTagsWithRating = await handleGetData(`miscellaneous/show_ratings_from_picture?picture_id=${image.id}`, token);
    
            if (dataTagsWithRating.response.length !== 0) {
                // Mapa de calificaciones para búsqueda eficiente
                const ratingsMap = dataTagsWithRating.response.reduce((acc, rating) => {
                    acc[rating[4]] = rating[2]; // rating[4] es idTag y rating[2] es el score
                    return acc;
                }, {});

                const tagsWithRating = newTags.map((newTag) => ({
                    ...newTag,
                    isSelect: ratingsMap[newTag.idTag] !== undefined,
                    rating: ratingsMap[newTag.idTag] || newTag.rating,
                    oldRating:ratingsMap[newTag.idTag] || undefined // Asigna la calificación si existe
                }));

                setTags(tagsWithRating);
                transformChangesToTags(tagsWithRating)
            } else {
                setTags(newTags);
                transformChangesToTags(newTags)
            }
            
    
        } catch (error) {
            console.error(error);
        }
    };

    const transformChangesToTags = (Tags) => {
        let newTags = [];
        const changesMap = changes.map((change)=>(change.idTag))

        Tags.forEach((tag)=>{
            if(changesMap.includes(tag.idTag)){
                const change = changes.find((change)=> change.idTag === tag.idTag)                
                    newTags.push({
                            ...tag,
                            isSelect:change.type !== "delete",
                            rating:change.rating
                        })                   
            }else{
                newTags.push(tag)
            }
        })    
        // Actualizar los tags después de procesar ambos cambios
        setTags(newTags);
    };

    
    


    if (!isActive) return null  
    return (
        <div
            onClick={handleClose}
            className='  fixed z-40 inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex justify-center items-center'>
            <div
                onClick={(e) => e.stopPropagation()}
                className="  bg-zinc-900 border border-gray-300 p-10  rounded-3xl flex justify-center items-center">
                <button onClick={handleClose} className=' absolute top-2 right-2 text-white text-xl hover:opacity-70'>
                    x
                </button>

                {cardImagePage !== 1 ? <button onClick={handlePrevious}
                    className='flex justify-center items-center py-3 px-3 bg-white rounded-full absolute top-1/2 left-2 text-white text-xl hover:opacity-70'>
                    <FontAwesomeIcon className="text-sm text-black" icon={faLessThan} />
                </button> : ""}
                {isNextPage ? <button onClick={handleNext}
                    className='flex justify-center items-center py-3 px-3 bg-white  rounded-full absolute top-1/2 right-2 text-white text-xl hover:opacity-70'>
                    <FontAwesomeIcon className="text-sm text-black" icon={faGreaterThan} />
                </button> : ""}
                <div className="h-full w-full flex flex-col justify-center items-center gap-y-4 ">

                    <ModalIMagen handleClose={handleCloseModal} image={image} isActive={isModalActive} />

                    {/* Fila para la imagen y el select */}
                    <div className=" flex justify-center items-center xl:items-start gap-x-10 sm:flex-col flex-col md:flex-col lg:flex-row xl:flex-row overflow-auto xl:overflow-hidden">
                    <div onClick={handleOpenModal} className="relative w-3/5 h-60 min-h-[30rem] bg-gray-200 flex items-center justify-center hover:cursor-pointer">
                        {image.link ? (
                            <img className="object-cover w-full h-full" src={image.link} alt="sin" />
                        ) : (
                            <p className="text-gray-500">No Image Available</p>
                        )}
                         <AnimatePresence>
                        {changes.length > 0 ? (
                        <motion.button
                            onClick={(e) => onLabel(e)}
                            title="guardar cambios"
                            className="absolute top-1/2 right-[-10px] transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white py-2 px-3 rounded-full"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label>
                            guardar <FontAwesomeIcon icon={faGreaterThan} />
                            </label>
                        </motion.button>
                        ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-1/2 right-[-15px] transform -translate-x-1/2 -translate-y-1/2"
                        >
                            <label
                            onClick={(e) => e.stopPropagation()}
                            title="sin cambios"
                            className="bg-green-500 px-3 py-2 rounded-full"
                            >
                            <FontAwesomeIcon className="text-white" icon={faCheck} />
                            </label>
                        </motion.div>
                        )}
                    </AnimatePresence>
                        </div>
                        
                        <div className="sm:invisible visible lg:visible md:visible xl:visible inline-block xl:min-h-[30rem] w-0.5 bg-zinc-600"></div>
                        <div className="flex-col  lg:self-start xl:self-start sm:flex sm:flex sm:justify-center sm-items-center sm:flex">
                            <select onChange={(e) => handleTags(e.target.value)} about="hola" className="text-gray-700">
                                {categories.map((category) => (
                                    <option value={category.id} className="text-gray-700" key={category.id * 10}>
                                        {category.field}
                                    </option>
                                ))}
                            </select>
                            <div className="pt-4 flex flex-col gap-y-2 ">
                                {tags.length > 0 ? tags.map((tag, index) => (
                                    <div className=" flex justify-center items-center flex-col" key={index}>
                                        <button
                                            onClick={(e) => handleSelect(e, tag)}
                                            className={`w-[330px] w-full px-4 ${tag.isSelect ? "bg-green-700" : "bg-gray-700"} rounded-full border border-gray-600 hover:brightness-75`}
                                            key={tag.idTag * 3}>
                                            {tag.name}
                                        </button>
                                        {tag.isSelect ?
                                            <div className="flex items-center justify-center flex-col">
                                                <p >Selecciona la calificacion de la etiqueta:  <span className="text-sky-300">{tags[index].rating}</span></p>
                                                <input
                                                    onChange={(e) => handleRatingChange(e, index)}
                                                    value={tags[index].rating}
                                                    type="range"
                                                    step="0.50"
                                                    max={3}
                                                    min={0}
                                                />
                                            </div>
                                            : ""}
                                    </div>
                                )) :
                                    <div className=" flex justify-center items-center flex-col">
                                        <p>Categoria sin etiquetas.</p>
                                        <p>Crea una</p>
                                        <FontAwesomeIcon className='pb-1 text-green-600' icon={faArrowDown} />
                                        <button onClick={handleClick} className="rounded-full bg-blue-700 px-6">Crear</button>
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center ">
                        <p>Usuario: <span className="text-sky-300">{userName}</span></p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Etiquetador