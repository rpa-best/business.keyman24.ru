import React from 'react';

export interface ImageType {
    id: number;
    image: string;
}

export interface ImageCarouselProps {
    images: ImageType[] | null;
    loading: boolean;
    uploadSettings?: { url: (() => string) | string };
    deleteSettings?: { url: (id: number) => string };
    setLoading: (v: boolean) => void;
}

export interface ImageCarouselUploadProps {
    setImages: React.Dispatch<React.SetStateAction<ImageType[] | null>>;
    setLoading: (v: boolean) => void;
    url: string;
}

export interface ImageCarouselItemProps {
    item: ImageType;
    handleDelete: ((id: number) => void) | null;
}

export interface ImageCarouselItemFullProps {
    item: ImageType;
    setFullView: (v: boolean) => void;
}
