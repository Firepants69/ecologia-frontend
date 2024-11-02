import React, { createContext, useState, useContext, useEffect, useMemo } from 'react'
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const [userData, setUserData] = useState(null)

    const [shouldRefresh, setShouldRefresh] = useState(false)

    const [shouldRefreshRatings, setShouldRefreshRatings] = useState(false)

    const [projectInformation, setProjectInformation] = useState(null)

    const [locationInformation, setLocationInformation] = useState(null)

    const [albumInformation, setAlbumInformation] = useState(null)

    const [files, setFiles] = useState([])

    const [images, setImages] = useState([])

    const [categoriesToDelete, setCategoriesToDelete] = useState([])

    const [categoryToDelete, setCategoryToDelete] = useState(null)


    const [fields, setFields] = useState([])

    const [isModalCategoryDeleteActive, setIsModalCategoryDeleteActive] = useState(true)

    const [image, setImage] = useState(null);

    const [userName, setUserName] = useState(null)

    const [pageImage, setPageImage] = useState(1)

    const [cardImagePage, setCardImagePage] = useState(1)

    const quantityImagePerPage = 20 

    const [isTaggerActive, setIsTaggerActive] = useState(false)

    const [backRoute,setBackRoute] = useState('/proyectos')

    const [changes ,setChanges] = useState([])

    const [maxPage, setMaxPage] = useState(1)

    const [deleteInformation,setDeleteInformation] = useState({})

    const [imagesInformation,setImagesInformation] = useState([])

    const [categorySelected, setCategorySelected] = useState(null)


    const navigate = useNavigate()




    const refreshProjects = (acction = ()=>{}) => {
        acction()
        setShouldRefresh(prev => !prev);
    };

    
    const refreshRatings = (acction = ()=>{}) => {
        acction()
        setShouldRefreshRatings(prev => !prev);
    };

    const login = (data,user) => {
        const token = data.token
        const decoded = jwtDecode(token)
        setIsAuthenticated(true)
        data.decoded = decoded
        data.userName = user
        console.log(data)
        setUserData(data)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userData', JSON.stringify(data))
    }
    const logout = () => {
        setIsAuthenticated(false)
        setUserData(null)
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');
        navigate("/login")
    }

    useEffect(() => {
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated')
        const storedUserData = localStorage.getItem('userData')
        if (storedIsAuthenticated === 'true' && storedUserData) {
            setIsAuthenticated(true)
            setUserData(JSON.parse(storedUserData))
        }

    }, [])

    const memoizedUserData = useMemo(() => userData, [userData])



    return (
        <AuthContext.Provider value={{
            isAuthenticated
            , userData
            , login
            , logout
            , refreshProjects
            , shouldRefresh
            , setProjectInformation
            , projectInformation
            , locationInformation
            , setLocationInformation
            , albumInformation
            , setAlbumInformation
            , files
            , setFiles
            , images
            , setImages
            , setCategoriesToDelete
            , categoriesToDelete
            , fields
            , setFields
            , categoryToDelete
            , setCategoryToDelete
            , isModalCategoryDeleteActive
            , setIsModalCategoryDeleteActive
            , image
            , setImage
            , setUserName
            , userName
            , pageImage
            , setPageImage
            , cardImagePage
            , setCardImagePage
            , quantityImagePerPage
            , isTaggerActive
            , setIsTaggerActive
            , backRoute
            , setBackRoute
            , changes
            , setChanges
            , maxPage
            , setMaxPage
            , deleteInformation
            , setDeleteInformation
            , imagesInformation
            , setImagesInformation
            , categorySelected
            , setCategorySelected
            , shouldRefreshRatings
            , refreshRatings

        }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}