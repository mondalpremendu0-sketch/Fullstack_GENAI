import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "../styles/NotFound.scss"; // We will create this next

export default function NotFound() {
const navigate = useNavigate();

  return (
    <motion.div className="not-found-container">
        <DotLottieReact
      src="https://lottie.host/43d096ee-b6e7-4ad4-b7d7-5d123849691e/3LYEuBqejs.json"
      loop
      autoplay
    />
    
    <motion.button 
    className="back-home-btn"
    onClick={()=>{navigate("/")}}
    >
      Go to Dashboard
    </motion.button>
    </motion.div>
  
  )

}