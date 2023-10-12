import React from 'react';
import { IInventory, IInventoryImage, IType } from 'http/types';

export interface IModifiedInventory
    extends Omit<IInventory, 'type' | 'location'> {
    type: string;
    location: string;
}

export interface InventoryModalProps {
    type: 'create' | 'edit';
    selectedItem?: IModifiedInventory;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    selectedImage: IInventoryImage[] | { img: File; preview: string }[];
    setSelectedImage: React.Dispatch<
        React.SetStateAction<
            IInventoryImage[] | { img: File; preview: string }[] | undefined
        >
    >;
    setInventoryData: React.Dispatch<
        React.SetStateAction<IModifiedInventory[]>
    >;
}

export interface ImageContainerProps {
    selectedImage: IInventoryImage[] | undefined;
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
