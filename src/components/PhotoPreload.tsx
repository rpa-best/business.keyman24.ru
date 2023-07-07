import React, { FC, useState } from 'react'

interface FormData {
    image: string | null
    preload: string
    alt: string
    // eslint-disable-next-line react/require-default-props
    className?: string
}

const PhotoPreload: FC<FormData> = props => {
    const { image, preload, alt, className = '' } = props
    const [imageLoaded, setImageLoaded] = useState(false)

    const handleImageLoaded = () => {
        setImageLoaded(true)
    }

    return (
        <>
            {image && (
                <img
                    src={image}
                    alt={alt}
                    onLoad={handleImageLoaded}
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                    className={className}
                />
            )}
            {!imageLoaded && (
                <img
                    src={preload}
                    alt='preload'
                    // style={{ display: image ? 'none' : 'block' }}
                    className={className}
                />
            )}
        </>
    )
}

export default PhotoPreload
