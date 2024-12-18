import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan,faCheck } from "@fortawesome/free-solid-svg-icons"
import { motion,AnimatePresence } from 'framer-motion';
import handleCreate from '../../../helpers/handleCreate';
import { useAuth } from '../../../AuthProvider';
import prefixUrl from '../../../helpers/ip';
import handleUpdate from '../../../helpers/handleUpdate';
import { handleDelete } from '../../../helpers/handleDelete';
function LabelImage({image,changes,handleOpenModal,setTags,setChanges}) {
  const {userData,refreshRatings} = useAuth()
  const userID = userData.decoded.user_id
  const token = userData.token
  const [isRatingChanges,setIsRatingChanges] = useState(false);

  const handleChanges = async (event) => {
    event.stopPropagation();
    setIsRatingChanges(true);
  
    const promises = changes.map(async (change) => {
      switch (change.type) {
        case "create":
          await handleCreateLabel(change);
          console.log("Se creó");
          break;
        case "update":
          await handleUpdateLabel(change);
          console.log("Se editó");
          break;
        case "delete":
          await handleDeleteLabel(change);
          console.log("Se eliminó");
          break;
        default:
          console.log("Ninguna acción");
          break;
      }
    });
  
    await Promise.all(promises);
    setChanges([]);
    setIsRatingChanges(false);
    refreshRatings();
  };
  
  const handleCreateLabel = (change) => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      const endPointUrl = `${prefixUrl}ratings/create_rating`;
  
      data.append('picture_id', image.id);
      data.append('user_id', userID);
      data.append('tag_id', change.idTag);
      data.append('rating_score', change.rating);
  
      handleCreate(endPointUrl, token, data, (responseData) => {
        setTags((tags) =>
          tags.map((tag) =>
            tag.idTag === change.idTag
              ? {
                  ...tag,
                  isSelect: true,
                  rating: change.rating,
                  oldRating: change.rating,
                  ratingID: responseData.rating_id,
                }
              : tag
          )
        );
        resolve();
      }, reject);
    });
  };
  
  const handleDeleteLabel = (change) => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      const endPointUrl = `ratings/delete_rating`;
  
      data.append('rating_id', change.ratingID);
  
      handleDelete(endPointUrl, data, token, () => {
        setTags((tags) =>
          tags.map((tag) =>
            tag.idTag === change.idTag
              ? {
                  ...tag,
                  isSelect: false,
                  rating: 0,
                  oldRating: undefined,
                  ratingID: undefined,
                }
              : tag
          )
        );
        resolve();
      }, reject);
    });
  };
  
  const handleUpdateLabel = (change) => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      const endPointUrl = `${prefixUrl}ratings/update_rating`;
  
      data.append('picture_id', image.id);
      data.append('user_id', userID);
      data.append('tag_id', change.idTag);
      data.append('rating_score', change.rating);
  
      handleUpdate(endPointUrl, token, data, () => {
        setTags((tags) =>
          tags.map((tag) =>
            tag.idTag === change.idTag
              ? { ...tag, rating: change.rating, oldRating: change.rating }
              : tag
          )
        );
        resolve();
      }, reject);
    });
  };

  return (
    <div onClick={handleOpenModal} className="relative w-[100%] xl:w-[600px] h-60 min-h-[30-rem] xl:min-h-[40rem] bg-gray-200 flex items-center justify-center hover:cursor-pointer">
         
          {image.url_original ? (
              <img className="object-cover w-full h-full" src={image.url_original} alt="sin" />
          ) : (
              <p className="text-gray-500">No Image Available</p>
          )}
            <AnimatePresence>
          {isRatingChanges? 
           <motion.button
           onClick={(e) => handleChanges(e)}
           title="guardar cambios"
           className="active:brightness-150 hover:brightness-110 click:brightness-150 px-3 py-2 absolute top-1/2 right-[-10px] transform -translate-x-1/2 -translate-y-1/2 bg-yellow-700 text-white rounded-full"
           initial={{ opacity: 0, scale: 0.7 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.7 }}
           transition={{ duration: 0.1 }}
       >
            <div className="loader-changes-rating"></div>
       </motion.button>
          :
          changes.length > 0 ? (
            <motion.button
                onClick={(e) => handleChanges(e)}
                title="guardar cambios"
                className="active:brightness-150 hover:brightness-110 click:brightness-150 px-3 py-2 absolute top-1/2 right-[-10px] transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-full"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.1 }}
            >
                <label>
                guardar <FontAwesomeIcon icon={faGreaterThan} />
                </label>
            </motion.button>
            ) : (
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.1 }}
                className="bg-green-500 px-3 py-2 rounded-full absolute top-1/2 right-[-15px] transform -translate-x-1/2 -translate-y-1/2"
            >
                <label
                onClick={(e) => e.stopPropagation()}
                title="sin cambios"
            
                >
                <FontAwesomeIcon className="text-white" icon={faCheck} />
                </label>
            </motion.div>
            )
          }
      </AnimatePresence>
    </div>
  )
}

export default LabelImage