"use client"


import { useState, useEffect} from "react";

export default function DurationDash(props: any){

let duration = props.duration.toString().slice(0, 3);



    return (
        <div className="flex justify-center items-center border-gray-400 w-[10vw] h-[10vw] border-[0.2vw] rounded-[1vw] m-[3vw]">
            <div className="flex w-[6vw] h-[6vw] bg-gray-500 rounded-[4vw] items-end-safe p-[1vw] justify-center">
            <p> {duration} </p>
            </div>
        </div>

    )
}