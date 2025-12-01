import React from 'react'
import { FaYoutube, FaFacebook, FaGoogle } from "react-icons/fa";


export default function SocialNavs() {
  return (
    <div className="grid grid-flow-col gap-4 text-2xl justify-center mt-3">
      <button type="button" className="hover:text-red-300 transition"><FaGoogle /></button>
      <button type="button" className="hover:text-red-600 transition"><FaYoutube /></button>
      <button type="button" className="hover:text-blue-600 transition"><FaFacebook /></button>
    </div>
  )
}
