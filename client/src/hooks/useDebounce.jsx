import { useEffect, useRef, useState } from "react"

export const useDebounce = (value, delay, options = {}) => {
    const [debouncedValue, setDebouncedValue] = useState('');
    const timeoutRef = useRef(null);

    useEffect(() => {
      const updateDebouncedValue = () => {
        setDebouncedValue(value);
      };
  
      clearTimeout(timeoutRef.current);
  
      timeoutRef.current = setTimeout(updateDebouncedValue, delay, ...(options.args || []));
  
      return () => clearTimeout(timeoutRef.current);
    }, [value, delay, options]);
  
    return debouncedValue;
  };