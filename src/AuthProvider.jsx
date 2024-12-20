import React, { createContext, useState, useContext, useEffect, useMemo } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useLocation, useNavigate } from 'react-router-dom'

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

    const [image, setImage] = useState({});

    const [userName, setUserName] = useState(null)

    const [pageImage, setPageImage] = useState(1)

    const [cardImagePage, setCardImagePage] = useState(1)

    const quantityImagePerPage = 20

    const [isTaggerActive, setIsTaggerActive] = useState(false)

    const [backRoute, setBackRoute] = useState('/proyectos')

    const [changes, setChanges] = useState([])

    const [maxPage, setMaxPage] = useState(1)

    const [deleteInformation, setDeleteInformation] = useState({})

    const [imagesInformation, setImagesInformation] = useState([])

    const [categorySelected, setCategorySelected] = useState(null)

    const [isCategoryMenuActivate, setIsCategoryMenuActivate] = useState(false)

    const [groupImages, setGroupImages] = useState([])

    const [projectsPath, setProjectsPath] = useState('/gestor/proyectos')

    const [dateUbication, setDateUbication] = useState([])

    const [indexDateUbicationImagesDate, setIndexDateUbicationImagesDate] = useState(1)

    const [initialDate, setInitialDate] = useState('');

    const [endDate, SetEndDate] = useState('');

    const [ranges, setRanges] = useState({ 0: false, 0.5: false, 1: false, 1.5: false, 2: false, 2.5: false, 3: false })

    const [isActiveSelect, setIsActiveSelect] = useState(true)

    const [projectsToFilter, SetProjectToFilter] = useState([])

    const [groupedTags, setGroupedTags] = useState({}); //

    const [locationToFilter, setLocationToFilter] = useState({})

    const [albumsToFilter, setAlbumsToFilter] = useState({})

    const [dateRange, setDateRange] = useState({ initDate: '', endDate: '' });

    const [selectedOrderFilter, setSelectedOrderFilter] = useState("None");

    const [filter, setFilter] = useState({ 'quantity': quantityImagePerPage })

    const [isNextPage, setIsNextPage] = useState(true)

    const [loadingComplete, setLoadingComplete] = useState(false)

    const [isLoadingStructure, setIsLoadingStructure] = useState({ project: false, location: false, album: false })

    const [noTagsFilter, setNotagsFilter] = useState(false)

    const [imagesTodelete, setImagesToDelete] = useState([])

    const [categories, setCategories] = useState([])

    const [allTags,setAllTags] = useState({})

    const [imagesExist,setImagesExist] = useState(false)

    const [isCompleteChargeTagsSelector,setIsCompleteChargeTagsSelector] = useState(true);    

    const [locationCharge,setLocationCharge] = useState({
        isProjectsCharge:true,
        isLocationCharge:true,
        isAlbumCharge:true,
    })

    const handleCategoryMenu = () => {
        setIsCategoryMenuActivate(prev => !prev)
    }


    const navigate = useNavigate()




    const refreshProjects = (acction = () => { }) => {
        acction()
        setShouldRefresh(prev => !prev);
    };


    const refreshRatings = (acction = () => { }) => {
        acction()
        setShouldRefreshRatings(prev => !prev);
    };

    const login = (data, user) => {
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
        navigate("/")
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
            , handleCategoryMenu
            , isCategoryMenuActivate
            , groupImages
            , setGroupImages
            , projectsPath
            , setProjectsPath
            , dateUbication
            , setDateUbication
            , indexDateUbicationImagesDate
            , setIndexDateUbicationImagesDate
            , initialDate
            , setInitialDate
            , endDate
            , SetEndDate
            , ranges
            , setRanges
            , isActiveSelect
            , setIsActiveSelect
            , projectsToFilter
            , SetProjectToFilter
            , groupedTags
            , setGroupedTags
            , locationToFilter
            , setLocationToFilter
            , albumsToFilter
            , setAlbumsToFilter
            , dateRange
            , setDateRange
            , selectedOrderFilter
            , setSelectedOrderFilter
            , filter
            , setFilter
            , isNextPage
            , setIsNextPage
            , loadingComplete
            , setLoadingComplete
            , isLoadingStructure
            , setIsLoadingStructure
            , noTagsFilter
            , setNotagsFilter
            , imagesTodelete
            , setImagesToDelete
            , categories
            , setCategories
            , allTags
            , setAllTags
            , imagesExist
            , setImagesExist
            , isCompleteChargeTagsSelector
            , setIsCompleteChargeTagsSelector
            , locationCharge
            , setLocationCharge
            
            

        }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}