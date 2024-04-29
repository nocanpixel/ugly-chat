import React from "react";
import './styles.css'

export const LoadingIcon =()=> {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <rect x="1" y="6" width="2.8" height="12" className="spinner_7uc5 fill-slate-300"></rect>
      <rect x="5.8" y="6" width="2.8" height="12" className="spinner_RibN fill-slate-300"></rect>
      <rect x="10.6" y="6" width="2.8" height="12" className="spinner_7uc5 fill-slate-300"></rect>
      <rect x="15.4" y="6" width="2.8" height="12" className="spinner_RibN fill-slate-300"></rect>
      <rect x="20.2" y="6" width="2.8" height="12" className="spinner_7uc5 fill-slate-300"></rect>
    </svg>
  );
}

export const DoubleCheckIcon = (props) => {
  return(
    <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="-2.4 -2.4 28.8 28.8"
  >
    <g {...props} strokeLinecap="round" strokeWidth="2.4">
      <path d="M1.5 12.5l4.076 4.076a.6.6 0 00.848 0L9 14M16 7l-4 4"></path>
      <path d="M7 12l4.576 4.576a.6.6 0 00.848 0L22 7"></path>
    </g>
  </svg>
  )
}