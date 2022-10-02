import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import axios from 'axios'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { setCastDevices, setSelectedCastDevice } from '../js/actions';
 
export const CastButton = () => {
    
	const castDevices = useSelector((state) => state.castDevices)
	// const selectedCastDevice = useSelector((state) => state.selectedCastDevice)
	const dispatch = useDispatch()

    async function getCastDevices() {
        const res = await axios.get("api/castDevices")
        dispatch(setCastDevices(res.data))
	}

    async function handleChange(name) {
        setSelectedCastDevice(name)
        await axios.get("/api/castDevice/" + name)
    };

    useEffect(() => {
        getCastDevices()
    }, [])

    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Cast Device</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
            >
                {castDevices.map(castDevice => (
                    <FormControlLabel
                        value={castDevice.friendlyName} 
                        key={castDevice.friendlyName} 
                        control={<Radio />} 
                        label={castDevice.friendlyName}
                        onChange={(event) => handleChange(castDevice.friendlyName)}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    )
}
