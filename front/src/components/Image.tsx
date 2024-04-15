import { CircularProgress, makeStyles } from '@material-ui/core'
import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { CSSProperties } from 'react'
import { useState } from 'react'

export const Image = ({
  src,
  alt,
  className,
  style,
}: {
  src: string
  alt?: string
  className?: string
  style?: CSSProperties
}) => {
  const styles = useStyles()

  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className={styles.container}>
      <img
        src={src}
        alt={alt}
        ref={imgRef}
        className={className}
        style={{ visibility: isLoading ? 'hidden' : 'visible', ...style }}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading ? <CircularProgress className={styles.progress} /> : null}
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'inline-block',
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))
