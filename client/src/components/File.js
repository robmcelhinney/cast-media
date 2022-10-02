import React, {useContext} from 'react'
import {useSelector} from "react-redux"
import iconFile from '../assets/icons/icon-file.svg'
import {simplifyParentPath} from '../utils/pathHelper'
import {LoggingContext} from '../context/logger'
import axios from 'axios'

export const File = ({ file, parentDir, currentDir }) => {
    const logger = useContext(LoggingContext)
	  
	const relDir = useSelector(state => state.relDir)
	// const selectedCastDevice = useSelector((state) => state.selectedCastDevice)

    async function castLink(ev, path) {
		ev.preventDefault()
		ev.stopPropagation()

        await axios.get(path)
			.catch(function (error) {
				logger.error(error)
			})
	}

    const downloadLink = () => {
		let path
		if (parentDir) {
			path = simplifyParentPath(relDir + file)
		}
		else if (currentDir) {
			path = relDir
		}
		else {
			path = relDir + file
		}
		return (
			<>
				<img src={iconFile} alt="File" 
						className={"h-5 w-5 md:h-6 md:w-6"}/>
				<button
						onClick={(e) => castLink(e, "/api/cast" + path)}
						download className={"text-gray-700 ml-2"}>
					{file}
				</button>
			</>
		)
    }

	return (
        <div className={"relative rounded overflow-hidden mt-2 border-solid border-2 border-gray-300"}>
			<div className={"px-6 py-4 flex"}>
            	{downloadLink()}
			</div>
        </div>
	)
}