import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthProvider";


export const TarjetaImagen = ({indexImageDate, image, totalImages, month }) => {
    const navigate = useNavigate()
    const {setIndexDateUbicationImagesDate} = useAuth()
    const location = useLocation();

    const handleNavigate = () => {
        setIndexDateUbicationImagesDate(indexImageDate)
        
        const searchParams = location.search;
        console.log(searchParams)
        navigate(`${month}${searchParams}`);
    }
    return (
        <div
            onClick={handleNavigate}
            className=" relative w-full h-full">

            <div className="hover:cursor-pointer">
                <div className="relative w-full h-48 min-h-[12rem] bg-gray-200 flex items-center justify-center aspect-[16/9]">
                    <img src={image.link} alt="burning" className="object-cover w-full h-full" />

                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <div className="mt-2 flex flex-row justify-center items-center gap-2">
                            <p className="font-bold text-2xl text-white flex justify-center items-center gap-2">
                                <span className="text-2xl">{totalImages}</span>
                                <span className="text-1xl opacity-60"> {">"}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default TarjetaImagen;