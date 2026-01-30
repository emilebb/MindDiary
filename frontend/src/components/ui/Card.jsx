import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  glass = false,
  onClick,
  ...props 
}) => {
  const baseStyles = "rounded-2xl transition-all duration-300";
  
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    dark: "bg-gray-800 border border-gray-700 shadow-lg",
    glass: glass ? "bg-white/10 backdrop-blur-md border border-white/20" : "",
    hover: hover ? "hover:shadow-lg hover:scale-[1.02] cursor-pointer" : ""
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={`${baseStyles} ${variants.default} ${variants.glass} ${variants.hover} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 pb-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 pb-6 pt-0 ${className}`}>
    {children}
  </div>
);

export default Card;
