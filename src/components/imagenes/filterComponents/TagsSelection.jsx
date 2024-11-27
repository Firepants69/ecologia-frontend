import React, { useEffect, useState } from 'react';
import handleGetData from '../../../helpers/handleGetData';
import { useAuth } from '../../../AuthProvider';

function TagsSelection() {

    const [searchString, setSearchString] = useState('');
    const { groupedTags
        , setGroupedTags, userData } = useAuth();

    const token = userData.token;

    useEffect(() => {
        if (Object.keys(groupedTags).length !== 0) {
            return
        }
        const getData = async () => {
            const endpointCategories = `tag_system/show_categories`;
            const categories = await handleGetData(endpointCategories, token);
            const response = categories.response;

            const groupedInfo = {}; // Objeto para agrupar por categoría

            for (let i = 0; i < response.length; i++) {
                if (response[i][0] !== 1) {
                    const endPointTags = `tag_system/show_tags?category_id=${response[i][0]}`;
                    const tagsCategories = await handleGetData(endPointTags, token);
                    const responseTags = tagsCategories.response;

                    responseTags.forEach(tag => {
                        const categoryName = response[i][1];
                        if (!groupedInfo[categoryName]) {
                            groupedInfo[categoryName] = [];
                        }
                        groupedInfo[categoryName].push({
                            tagID: tag[0],
                            tagName: tag[1],
                            categoryID: tag[2],
                            isSelected: false,
                        });
                    });
                }
            }

            setGroupedTags(groupedInfo); // Actualiza el estado con la información agrupada
            console.log("Tags agrupados por categoría: ", groupedInfo);
        };

        getData();
    }, []);

    return (
        <div className='w-[310px] p-4 max-h-[20rem] overflow-y-auto bg-zinc-700 rounded-md'>
            {/* Barra de búsqueda */}
            <input
                type="text"
                placeholder="Buscar etiquetas..."
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                className="w-full mb-4 p-2 rounded-md text-sm bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Renderizado de tags agrupados */}
            {Object.entries(groupedTags).map(([categoryName, tags]) => (
                <div key={categoryName} className="mb-4">
                    <h3 className="text-green-500 font-bold">{tags.filter(tag => tag.tagName.toLowerCase().includes(searchString.toLowerCase())).length > 0 && tags.length > 0 ? categoryName : ""}</h3>
                    <div className="flex flex-col gap-2 mt-2">
                        {tags
                            .filter(tag => tag.tagName.toLowerCase().includes(searchString.toLowerCase())) // Filtrar por búsqueda
                            .map(tag => (
                                <button
                                    key={tag.tagID}
                                    className={`overflow-hidden whitespace-nowrap text-ellipsis px-2  hover:brightness-200 hover:bg-transparent hover:border-4 hover:border-green-700 hover:text-green-500 text-sm flex 
                                        ${tag.isSelected
                                            ? 'brightness-200 bg-transparent border-4 border-green-800 text-green-900'
                                            : ' border-4 border-zinc-800 bg-zinc-800'}`}
                                    onClick={() => {
                                        // Cambiar estado de selección
                                        const updatedTags = { ...groupedTags };
                                        const tagIndex = updatedTags[categoryName].findIndex(t => t.tagID === tag.tagID);
                                        updatedTags[categoryName][tagIndex].isSelected = !tag.isSelected;
                                        setGroupedTags(updatedTags);
                                    }}
                                >
                                    {tag.tagName}
                                </button>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TagsSelection;
