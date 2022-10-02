import React from 'react'
import {Files} from './Files'
import {CastButton} from './CastButton'
import {Logger} from './Logging'
import {LoggingContext} from '../context/logger'
import {Recorder} from './Recorder'

const App = () => {
	const logger = Logger()
	return (
		<LoggingContext.Provider value={logger}>
			<div id={"App bg-white rounded-lg p-6 mainContent"}>
				<Files />
				<CastButton />
				<Recorder />
			</div>
		</LoggingContext.Provider>
	)
}

export default App
