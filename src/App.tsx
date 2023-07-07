import React, { FC } from 'react'
import { RouterProvider } from 'react-router-dom'
import './assets/styles/css/app.css'
import useTheme from './hooks/useTheme'
import router from './router'

const App: FC = () => {
    const { theme, setTheme } = useTheme()

    return (
        <div className='app-wrapper'>
            <RouterProvider router={router} />
        </div>
    )
}

export default App
