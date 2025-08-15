import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function ProtectedWrapper (props) {
    const {Component} = props
    const navigate = useNavigate()
    useEffect(() => {
        let userDetails = JSON.parse(localStorage.getItem('UserData'))
        if(!userDetails) {
            navigate('/')
        }
    })

    return (
        <div>
            <Component />
        </div>
    )
}