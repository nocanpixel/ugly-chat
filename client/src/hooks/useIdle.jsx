import React, { useState } from 'react'
import { useIdleTimer } from 'react-idle-timer'

export const useIdle = (timeout=3_000) => {
    const [state, setState] = useState(true);

    const onIdle = ( ) => {
        setState(false);
    }

    const onActive = ( ) => {
        setState(true);
    }

    const {} = useIdleTimer({
        onActive,
        onIdle,
        timeout: timeout,
        throttle: 500
      })



    return state;
}
