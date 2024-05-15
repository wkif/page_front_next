// useWatch.ts
import { useEffect, useRef } from 'react'

type Callback<T> = (prev?: T) => void
interface Config {
    immdiate: Boolean
}

const useWatch = <T>(data: T, callback: Callback<T>, config: Config = { immdiate: false }) => {
    const prev = useRef<T>()
    const { immdiate } = config
    const inited = useRef(false)
    const stop = useRef(false)
    useEffect(() => {
        const execute = () => callback(prev.current)
        if (!stop.current) {
            if (!inited.current) {
                inited.current = true
                immdiate && execute()
            } else {
                execute()
            }
            prev.current = data
        }
    }, [data])

    return () => stop.current = true
}

export default useWatch

