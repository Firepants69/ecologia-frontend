import { useEffect, useState } from "react"
import { useAuth } from "../AuthProvider"
import { CategorysSelector } from "../components/etiqueta/CategorysSelector"
import handleGetData from "../helpers/handleGetData"
import Tags from "../components/etiqueta/Tags"
import { PieChart } from "@mui/x-charts"
export const CategoriaEtiqueta = () => {


    const { categories, setCategories, userData,allTags } = useAuth();
    const token = userData.token;
    const [categoriesInfo,setCategoriesInfo] = useState([]);

    useEffect(() => {

        const getData = async () => {
            const endpoint = `tag_system/show_categories`;
            const response = await handleGetData(endpoint, token);
            const categories = []
            response?.response.forEach(category => {
                if (category?.[0] != 1) {
                    categories.push(
                        {
                            name: category?.[1],
                            originalName: category?.[1],
                            id: category?.[0],
                            isSelected: true,
                            isEditActive: false,
                            willDeleted: false
                        }
                    )
                }
            });

            console.log(categories);
            setCategories(categories);
        }
        getData();
    }, [])

    useEffect(()=>{
        if(Object.keys(allTags).length  === categories.length){
           const keys = Object.keys(allTags);
           let total_tags = {}
           keys.forEach(key=>{
                let total = 0;
                allTags[key].forEach(tag=>{
                    total += tag.used;
                })
                total_tags[key] = total;
           })
           console.log("total ",total_tags);
           const newCategoriesInfo = []
           keys.forEach((key,index)=>{
                newCategoriesInfo.push({
                    id:index,value:total_tags[key],label:key
                   });
           });

           const series =[
            {
              data: newCategoriesInfo,
            },
          ]
           console.log("categorias",newCategoriesInfo);
           setCategoriesInfo(series);
        }
    },
    [allTags])

    useEffect(() => {
        // Cambiar la clase del body cuando el componente se monta
        document.body.className = "bg-gradient-to-r from-gray-900 to-blue-gray-950";
    
        // Limpiar las clases al desmontar el componente
        return () => {
          document.body.className = "bg-black";
        };
      }, []);

    return (

          <div className="mt-32 mb-24">
             <CategorysSelector />
            
             
            <div className="mt-14 flex justify-center items-center flex-col">
            <label 
                className="mt-14 rounded-2xl w-[70vw] py-2 px-10 bg-gray-700 flex  justify-start text-4xl mb-6"> Proporción de uso</label>
            <div className="hidden xl:block bg-zinc-300 rounded-xl py-2 w-[70vw]">
            { categoriesInfo.length >0 && Object.keys(allTags).length === categories.length  && 
            <PieChart
            series={categoriesInfo}
            width={1300}
            height={200}
            />
            }
            </div>
            {categories.filter(category => category.isSelected).map((category, index) => (
                <div key={index}>
                <label 
                className="mt-14 rounded-2xl px-10 bg-gray-700 flex  justify-start text-3xl mb-6"> {category.name}</label>
                <Tags  categoryName={category.name} categoryId={category.id}/>
                </div>
            ))}
            </div>
        </div>

    )

}

export default CategoriaEtiqueta