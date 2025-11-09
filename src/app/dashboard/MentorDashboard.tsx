"use client"


import { useReducer, useState, useEffect } from "react"
import MentorCardAdmin from "./MentorCardAdmin"
import MentorChangeView from "./MentorChangeView"

export default function MentorDashboard(){

    return (
        <div>
            <div className="flex items-start my-10">
            <p className="font-bold text-2xl">Mentoren Verwaltung</p>
            </div>
            <MentorChangeView />
        </div>
    )
}