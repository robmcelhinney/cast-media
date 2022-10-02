import React, {useState, useEffect, useContext} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {File} from './File'
import {getFiles, getRelDir} from '../utils/dirHelper'
import {setFiles, setRelDir} from "../js/actions/index.js"
import iconRefresh from '../assets/icons/icon-refresh.svg'
import axios from 'axios'
import {LoggingContext} from '../context/logger'

export const Files = () => {

    const [baseDir, setBaseDir] = useState('')

	const dispatch = useDispatch()
    const logger = useContext(LoggingContext)

    const files = useSelector(state => state.files)
    const relDir = useSelector(state => state.relDir)

	useEffect(() => {
        setRelDirRefreshFiles("")
    }, [])

    useEffect(() => {
        fetchBaseDir()
    }, [])


    async function fetchBaseDir() {
        const res = await axios.get("/api/baseDir")
        logger.info("fetch res.data: %s", res.data)
        setBaseDir(res.data)
    }
  
    const setRelDirRefreshFiles = async (path) => {
        logger.info("path: %s", path)
        dispatch(setRelDir(getRelDir(path)))
        const files = await getFiles(path)
        dispatch(setFiles(files))
    }

    const refreshFiles = async () => {
        logger.info("refreshFiles relDir: %s", relDir)
        const files = await getFiles(relDir)
        dispatch(setFiles(files))
    }

    const switchSlashes = (str) => {
        return (str.replace(/\\/g, "/"))
    }

    return (
        <div id={"file-list"} 
                className={"mt-4 mb-10 md:mb-8 w-full relative max-w-m " +
                "text-sm md:text-base mt-4"}>
            <span className={"flex"}>
                <span className={"text-gray-500 font-medium ml-8"}>
                    {switchSlashes(baseDir)}
                </span>
                <img src={iconRefresh} alt="Folder" 
                        className={"absolute right-0 text-gray-700 " + 
                            "mr-4 md:mr-8 h-5 w-5 md:h-6 md:w-6 cursor-pointer"}
                        onClick={refreshFiles} />
            </span>
            {Object.keys(files).map(file => (
                <File file={file} key={file} 
                    currentDir={false}/>
            ))}
        </div>
    )
}