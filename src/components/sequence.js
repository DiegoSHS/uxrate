import { Box, Button, Paper, Stepper, Typography } from '@mui/material'
import { useState } from 'react'
import { RateResults } from './resume'
import { RateStep } from './steps'
import { StoredContext } from '@/context/context'
import { saveRecord } from '@/requests/uxrecord'
import toast from 'react-hot-toast'
import { steps } from '@/utils/steps'
import { signIn } from 'next-auth/react'

export default function RateSequence() {
    const { interacts: { name, results, user, site }, setInteract, records, setRecords, push } = StoredContext()
    const [activeStep, setActiveStep] = useState(0)
    const [sliderValue, setSliderValue] = useState(0)
    const [error, setError] = useState(null)
    const handleSlider = (e, newValue) => {
        setSliderValue(newValue)
        handleRegister()
    }
    const handleRegister = () => {
        setRecords((records) => {
            if (records.length === 0) {
                return [{ activeStep, sliderValue }]
            }
            return [...records.filter(e => e.activeStep !== activeStep), { activeStep, sliderValue }]
        })
    }
    const deleteRegister = () => {
        setRecords([...records.filter(e => e.activeStep !== activeStep - 1)])
    }
    const handleNext = () => {
        handleRegister()
        setActiveStep(activeStep + 1)
        setSliderValue(0)
    }
    const handleBack = () => {
        deleteRegister()
        setActiveStep(activeStep - 1)
        setSliderValue(0)
    }
    const handleReset = () => {
        setActiveStep(0)
        setRecords([])
        setInteract({ name: null })
        setSliderValue(0)
        push('/')
    }

    const handleSave = async () => {
        if (!user.name) {
            signIn()
            return
        }
        toast.promise(saveRecord({ name, records, email: user.email, site }), {
            loading: 'guardando',
            success: (data) => {
                if (data.error) {
                    console.log(data.error)
                    setError(error)
                    return 'Error al guardar'
                }
                setInteract({ results: [...results, { _id: data.insertedId, name, records }] })
                push('/records')
                return 'Guardado!'
            },
            error: (data) => `${data.msj}`
        }, {
            success: { icon: false },
            position: 'top-right'
        })
    }
    const stepslen = steps.length
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
        }}>
            {!(activeStep === stepslen) && (
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => RateStep({ step, index, stepslen, sliderValue, handleBack, handleNext, handleSlider }))}
                </Stepper>
            )}
            {activeStep === stepslen && (
                <Box>
                    <RateResults results={[{ name: name, records }]} />
                    <Paper square elevation={0} sx={{ p: 3 }}>
                        <Button color='secondary' onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                            Evaluar otro sitio
                        </Button>
                        <Button variant='contained' color='success' onClick={handleSave} sx={{ mt: 1, mr: 1 }}>
                            {user.name ? 'Guardar resultados' : 'Iniciar sesión para guardar'}
                        </Button>
                        {error ? (
                            <Typography variant='caption' color='error'>
                                Error: {error.message}
                            </Typography>
                        ) : ('')}
                    </Paper>
                </Box>
            )}
        </Box>
    )
}