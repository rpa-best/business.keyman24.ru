import React from 'react';
import { IInventory, IInventoryImage, IType } from 'http/types';

export interface IModifiedInventory extends Omit<IInventory, 'type'> {
    type: string;
}

export interface InventoryModalProps {
    type: 'create' | 'edit';
    lastId: number;
    selectedItem?: IModifiedInventory;
    selectedImage: IInventoryImage[] | { img: File; preview: string }[];
    setSelectedImage: React.Dispatch<
        React.SetStateAction<
            IInventoryImage[] | { img: File; preview: string }[] | undefined
        >
    >;
}

export interface ImageContainerProps {
    selectedImage: IInventoryImage[];
    selectedItemId: number;
    setLoading: (b: boolean) => void;
    rootProps: any;
    setSelectedImage: React.Dispatch<
        React.SetStateAction<IInventoryImage[] | undefined>
    >;
}

export interface ImageContainerCreateProps {
    selectedImage: { img: File; preview: string }[];
    rootProps: any;
    setSelectedImage: React.Dispatch<
        React.SetStateAction<{ img: File; preview: string }[] | undefined>
    >;
}

export interface InventoryWrapperProps {
    inventory: IModifiedInventory[];
    count: number;
}
