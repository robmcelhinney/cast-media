import React, {useState, useContext} from 'react'
import { ReactMic } from 'react-mic'
import {LoggingContext} from '../context/logger'

export const Recorder = () => {
    const [record, setRecord] = useState(false)
    const [blobURL, setBlobURL] = useState('')

    const logger = useContext(LoggingContext)

    const startRecording = () => {
        setRecord(true)
    }
    
    const stopRecording = () => {
        setRecord(false)
    }

    const onData = () => {
        logger.info('This function does not return an object, but is called at a time interval of 10ms')
    }

    const onStop = async (recordedBlob) => {
        const data = new FormData();
        data.append("file", recordedBlob["blob"], "test.mp3")
        const postRequest = {
            method: "POST",
            body: data
        }

        return fetch('/api/upload', postRequest)
        .then(function (response) {
            logger.info("Successfully uploaded file recording.")
        })
        .catch(function (error) {
            logger.info("Failed to upload recording. error: ", error)
        })

    }

    return (
        <div>
            <ReactMic
                record={record}
                className="sound-wave"
                onStop={onStop}
                onData={onData}
                strokeColor="#000000"
                backgroundColor="#FF4081" 
                mimeType="audio/mp3"
                autoGainControl={true}
            />
            <button onClick={startRecording} type="button">Start</button>
            <button onClick={stopRecording} type="button">Stop</button>
        </div>
    )
}