import { useAuth } from "../../AuthProvider"
import { useEffect, useState } from "react";
import ModalIMagen from "./ModalIMagen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faLessThan } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import handleGetData from "../../helpers/handleGetData";
import handleGet from "../../helpers/handleGet";
import LabelWrapper from "./label components/labelWrapper";
import LabelImage from "./label components/LabelImage";
import TagsSelector from "./label components/TagsSelector";
import RatingsVisualizer from "./label components/RatingsVisualizer";

export const Etiquetador = ({ isActive, handleClose }) => {

    const navigate = useNavigate()
    const {
        setMaxPage, maxPage,
        changes, setChanges,
        cardImagePage,
        setCardImagePage,
        setImage,
        image,
        userData,
        isCategoryMenuActivate,
    } = useAuth()
    const token = userData.token
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [isModalActive, setIsModalActive] = useState(false)
    const [isNextPage, setIsNextPage] = useState(true)
    const { albumID } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const userID = userData.decoded.user_id
    const [componentToRender, setComponentToRender] = useState(null);
    const [dateParam,setDateParam]=useState({initialDate:null,finalDate:null})

    useEffect(() => {
        document.body.className = ' bg-gradient-to-r from-gray-900 to-blue-gray-950';
        console.log("esta activado el menu de categorias:", isCategoryMenuActivate)
        const initialDate =searchParams.get('initial-date')
        const finalDate =searchParams.get('final-date')
        if(initialDate && finalDate){
            // esto lo voy a cambiar creo
            setDateParam({finalDate:finalDate,initialDate:initialDate})
        }
        const paramsFilters =initialDate &&finalDate?`&startDate=${initialDate}&endDate=${finalDate}`:""
        // conseguir el numero de la ultima pagina 
        const endPointPage = `pictures/show_picture_from_album?page=${cardImagePage}&quantity=${1}&album_id=${albumID}${paramsFilters}`
        handleGetData(endPointPage, token).then((data) => {
            setMaxPage(data.total_pages)
            handleIsNextPage()
        })

        const endPointCategories = `tag_system/show_categories?page=${1}&quantity=${100}`

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



    }, [cardImagePage, image, isCategoryMenuActivate]);


    const handleClick = () => {
        // Aquí puedes realizar alguna lógica antes de redirigir
        navigate('/categoria-etiqueta');
    };

    
    const handleIsNextPage = () => {
        if (cardImagePage < maxPage) {
            setIsNextPage(true)
        } else {
            setIsNextPage(false)
        }
    }
    const handleNext = async () => {
        const paramsFilters =dateParam.initialDate &&dateParam.finalDate?`&startDate=${dateParam.initialDate}&endDate=${dateParam.finalDate}`:""
        const endPoint = `pictures/show_picture_from_album?page=${cardImagePage + 1}&quantity=${1}&album_id=${albumID}${paramsFilters}`;
        try {
            console.log(endPoint)
            const data = await handleGet(endPoint, token);
            
            if (data && data.length > 0) {
                const newImages = data.map((response) => ({
                    link: response[0],
                    id: response[1],
                    date: response[2],
                }));
                setImage(newImages[0]);
                setSearchParams((params) => {
                    params.set("image-page", cardImagePage + 1);
                    return params;
                });
    
                setCardImagePage(prevPage => prevPage + 1);  // Asegúrate de actualizar correctamente el estado de la página
                handleIsNextPage();  // Verifica si hay más páginas después de actualizar el estado
                setChanges([]); // Resetea los cambios si es necesario
            }
        } catch (error) {
            console.error(error);
        }
    };
        
    const handlePrevious = async () => {
        const paramsFilters =dateParam.initialDate &&dateParam.finalDate?`&startDate=${dateParam.initialDate}&endDate=${dateParam.finalDate}`:""
       
        const endPoint = `pictures/show_picture_from_album?page=${cardImagePage - 1}&quantity=${1}&album_id=${albumID}${paramsFilters}`;
        console.log(endPoint)
        
        let data = [image];
        try {
            data = await handleGet(endPoint, token);
        } catch (error) {
            console.error(error);
        }
    
        const newImages = data.map((response) => ({
            link: response[0],
            id: response[1],
            date: response[2],
        }));
    
        setImage(newImages[0]);
        setSearchParams((params) => {
            params.set("image-page", Number(cardImagePage) - 1);
            return params;
        });
    
        // Actualiza correctamente el estado de la página y recalcula si hay una página siguiente
        setCardImagePage((prevPage) => prevPage - 1);
        handleIsNextPage();  // Este método se llama después de actualizar el estado de la página
        setChanges([]);
    };
    
    const handleSelect = (e, tag) => {
        e.preventDefault()
        let newTags = []
        tags.forEach((tagEach) => {
            if (tagEach === tag) {
                newTags.push({
                    ...tag,
                    isSelect: !tag.isSelect,
                })
                console.log(tag)
                if (tagEach.isSelect) {
                    updateCreateDeselect(tagEach)
                } if (tagEach.oldRating == undefined && !tagEach.isSelect) {
                    setChanges((changes) => [...changes, { type: "create", idTag: tag.idTag, name: tag.name, rating: tag.rating, id: `${tag.idTag}1` }])
                } if (tagEach.oldRating != undefined) {
                    const exists = changes.some((change) => change.idTag === tag.idTag)
                    if (exists) {
                        if (changes.some((change) => change.idTag === tag.idTag && change.type == "update")) {
                            setChanges((changes) => [...changes, { type: "delete", idTag: tag.idTag, name: tag.name, rating: tag.oldRating, id: `${tag.idTag}3`, ratingID: tag.ratingID }])
                        } else {
                            updateCreateDeselect(tag)
                            if (tagEach.rating != tagEach.oldRating) {
                                setChanges((changes) => [...changes, { type: "update", idTag: tag.idTag, name: tag.name, rating: tag.rating, id: `${tag.idTag}2` }])
                            }
                        }
                    } else {
                        setChanges((changes) => [...changes, { type: "delete", idTag: tag.idTag, name: tag.name, rating: tag.rating, id: `${tag.idTag}3`, ratingID: tag.ratingID }])
                    }
                }
            } else {
                newTags.push(tagEach)
            }
        })
        setTags(newTags)

    }

    const updateCreateDeselect = (tag) => {
        setChanges((changes) => {
            let newChanges = []
            changes.forEach((change) => {
                if (change.idTag !== tag.idTag) {
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

        if (newTags[tagIndex].oldRating != undefined) {
            handleUpdateRatingChage(tagIndex, newTags)
        } else {
            updateCreateRating(tagIndex, newTags)
        }
        setTags(newTags)
    };

    const handleUpdateRatingChage = (index, newTags) => {
        if (Number(newTags[index].oldRating) === Number(newTags[index].rating)) {
            let newChanges = []
            changes.forEach((change) => {
                if (change.id !== `${newTags[index].idTag}2`) {
                    newChanges.push(change)
                }
            })
            setChanges(newChanges)
            return
        }
        const existsRecord = changes.some((change) => change.id === `${newTags[index].idTag}2`)
        if (existsRecord) {
            const newChanges = changes.map((change) => (
                change.id === `${newTags[index].idTag}2` ? { ...change, rating: newTags[index].rating } : change
            ))

            setChanges(newChanges)
        } else {
            setChanges((changes) => [...changes, { type: "update", idTag: newTags[index].idTag, name: newTags[index].name, rating: newTags[index].rating, id: `${newTags[index].idTag}2` }])
        }
    }

    const updateCreateRating = (index, newTags) => {
        let newChanges = []
        changes.forEach((change) => {
            if (change.id === `${newTags[index].idTag}1`) {
                newChanges.push({ type: "create", idTag: newTags[index].idTag, name: newTags[index].name, rating: newTags[index].rating, id: `${newTags[index].idTag}1` })
            } else {
                newChanges.push(change)
            }
        })
        setChanges(newChanges)
    }




    const handleTags = async (id) => {
        setComponentToRender(<RatingsVisualizer
            componentToRender={componentToRender}
            categoryId={id}
        />); // Actualiza el componente a renderizar


        try {
            let newTags = [];

            // Obtener etiquetas (tags) sin calificación
            const dataTags = await handleGetData(`tag_system/show_tags?category_id=${id}`, token);
            newTags = dataTags.response.map((informacion) => ({
                name: informacion[1],
                idTag: informacion[0],
                isSelect: false,
                rating: 0,
                oldRating: undefined,
                ratingID: undefined
            }));
            console.log("id id id id id", id)
            // Obtener etiquetas con calificación
            const dataTagsWithRating = await handleGetData(`ratings/show_ratings_from_user?picture_id=${image.id}&user_id=${userID}&category_id=${id}`, token);
            console.log("datos de mierdaaaa :", dataTagsWithRating)
            if (dataTagsWithRating.response.length != 0) {
                // Mapa de calificaciones para búsqueda eficiente
                const ratingsMap = dataTagsWithRating.response.reduce((acc, rating) => {
                    acc[rating[4]] = [rating[2], rating[5]];
                    return acc;
                }, {});

                console.log(ratingsMap)

                const tagsWithRating = newTags.map((newTag) => {
                    const ratingInfo = ratingsMap[newTag.idTag]; // No asignamos un arreglo vacío, sino que dejamos undefined si no se encuentra
                    return {
                        ...newTag,
                        isSelect: ratingInfo ? true : false, // Verifica si ratingInfo existe
                        rating: ratingInfo ? ratingInfo[0] : 0, // Asigna ratingInfo[0] o undefined
                        oldRating: ratingInfo ? ratingInfo[0] : undefined, // Asigna ratingInfo[0] o undefined
                        ratingID: ratingInfo ? ratingInfo[1] : undefined // Asigna ratingInfo[1] o undefined
                    };
                });

                setTags(tagsWithRating);
                console.log(tagsWithRating)
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
        const changesMap = changes.map((change) => (change.idTag))

        Tags.forEach((tag) => {
            if (changesMap.includes(tag.idTag)) {
                const change = changes.find((change) => change.idTag === tag.idTag)
                newTags.push({
                    ...tag,
                    isSelect: change.type !== "delete",
                    rating: change.rating
                })
            } else {
                newTags.push(tag)
            }
        })
        // Actualizar los tags después de procesar ambos cambios
        setTags(newTags);
    };


    if (!isActive) return null
    return (
        <LabelWrapper handleClose={handleClose} >
            {cardImagePage != 1 ? <button onClick={handlePrevious}
                className='z-40 flex justify-center items-center py-3 px-3 bg-white rounded-full absolute top-1/2 left-2 text-white text-xl hover:opacity-70'>
                <FontAwesomeIcon className="text-sm text-black" icon={faLessThan} />
            </button> : ""}
            {isNextPage ? <button onClick={handleNext}
                className='z-40 flex justify-center items-center py-3 px-3 bg-white  rounded-full absolute top-1/2 right-2 text-white text-xl hover:opacity-70'>
                <FontAwesomeIcon className="text-sm text-black" icon={faGreaterThan} />
            </button> : ""}
            <div className="h-full w-full flex flex-col justify-center items-center gap-y-4 ">

                <ModalIMagen handleClose={handleCloseModal} image={image} isActive={isModalActive} />

                {/* Fila para la imagen y el select */}
                <div className=" flex justify-center items-center xl:items-start gap-x-10 sm:flex-col flex-col md:flex-col lg:flex-row xl:flex-row  xl:overflow-hidden">
                    {isCategoryMenuActivate ? componentToRender : ""}
                    <div className="min-h-[40rem] bg-zinc-800  hidden xl:block max-h-[40rem] w-[350px] overflow-y-auto">
                        {componentToRender}
                    </div>


                    <LabelImage
                        setTags={setTags}
                        tags={tags}
                        changes={changes}
                        image={image}
                        setChanges={setChanges}
                        handleOpenModal={handleOpenModal} />
                    {/* <CambiosEtiquetas changes={changes}/> */}
                    {/* <div className="sm:invisible visible lg:visible md:visible xl:visible inline-block xl:min-h-[40rem] w-0.5 bg-zinc-600"></div> */}
                    <TagsSelector
                        categories={categories}
                        handleClick={handleClick}
                        handleSelect={handleSelect}
                        handleTags={handleTags}
                        tags={tags}
                        handleRatingChange={handleRatingChange} />
                </div>
                <div className="flex flex-col items-center ">
                </div>
            </div>
        </LabelWrapper>

    )
}

export default Etiquetador