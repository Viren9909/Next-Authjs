"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const SessionWropper = ({ children }) => {
    return (
        <div className='h-full'>
            <SessionProvider>
                {children}
            </SessionProvider>
        </div>
    )
}

export default SessionWropper
