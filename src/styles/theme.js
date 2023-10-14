import { TopBarScroll } from '@/components/topBar'
import { Context } from '@/context/context'
import { Container, CssBaseline, ThemeProvider, colors, createTheme } from '@mui/material'
import { CookiesProvider, useCookies } from 'react-cookie'
import { Toaster } from 'react-hot-toast'

const defaultTheme = createTheme()
const darkTheme = createTheme({
    palette: { mode: 'dark',background:{default:'5c5c5c'} },
})

export default function Layout({ children }) {
    const themes = [darkTheme, defaultTheme]
    const [cookies] = useCookies(['theme'])
    const theme = cookies.theme ? 1 : 0
    return (
        <Context>
            <CookiesProvider>
                <ThemeProvider theme={themes[theme]}>
                    <CssBaseline enableColorScheme />
                    <Toaster />
                    <Container sx={{ my: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }} fixed component='main' maxWidth='sm'>
                        <title>UXRATE</title>
                        <TopBarScroll />
                        {children}
                    </Container>
                </ThemeProvider>
            </CookiesProvider>
        </Context>
    )
}