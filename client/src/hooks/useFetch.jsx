import { useEffect, useState } from "react"

export const useFetch = (urls) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(()=>{
        (async () => {
            try {
                setIsLoading(true);
                const responses = await Promise.all(urls.map(endpoint => endpoint()));
                const data = responses.map(response => response.data);
                const [ users ] = data;
                const format = users.map((ele)=> ele)
                setData(format);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        })();
    },[]);


    return {
        data,
        isLoading,
        error,
    }
}