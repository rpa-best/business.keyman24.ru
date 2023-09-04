import React from 'react';
import { IInventory, IInventoryImage, IType } from 'http/types';

export interface IModifiedInventory extends Omit<IInventory, 'type'> {
    type: string;
}

export interface InventoryModalProps {
    type: 'create' | 'edit';
    inventoryTypes: IType[];
    selectedItem?: IModifiedInventory;
    selectedImage: IInventoryImage[] | string[];
    setSelectedImage: React.Dispatch<
        React.SetStateAction<IInventoryImage[] | string[] | undefined>
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
    selectedImage: string[];
    rootProps: any;
    setSelectedImage: React.Dispatch<
        React.SetStateAction<string[] | undefined>
    >;
}

export interface InventoryWrapperProps {
    inventory: IModifiedInventory[];
    count: number;
    inventoryTypes: IType[];
}
