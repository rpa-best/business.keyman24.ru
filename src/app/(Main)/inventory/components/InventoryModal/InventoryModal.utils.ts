import { InventoryFormType } from 'app/(Main)/inventory/components/InventoryModal/types';
import {
    createInventoryItem,
    updateInventoryItem,
    uploadInventoryPhoto,
} from 'http/inventoryApi';
import revalidate from 'utils/revalidate';
import { IInventoryImage, ILocation, ReqInventoryBody } from 'http/types';
import { IModifiedInventory } from 'app/(Main)/inventory/types';
import React from 'react';

interface ErrorType extends InventoryFormType {}

interface InventoryFormSubmitProps {
    body: ReqInventoryBody;
    type: 'create' | 'edit';
    setInventoryData: React.Dispatch<
        React.SetStateAction<IModifiedInventory[]>
    >;
    setVisible: (v: boolean) => void;
    path: string;
    selectedImage: IInventoryImage[] | { img: File; preview: string }[];
    setSelectedImage: React.Dispatch<
        React.SetStateAction<
            IInventoryImage[] | { img: File; preview: string }[] | undefined
        >
    >;
    locations: ILocation[];
    selectedItem: IModifiedInventory | undefined;
}

export const InventoryFormValidate = (values: InventoryFormType) => {
    const errors: Partial<ErrorType> = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    /*    if (!values.number) {
        errors.number = 'Обязательное поле';
    }*/

    return errors;
};

export const InventoryFormSubmit = async ({
    body,
    type,
    setInventoryData,
    setVisible,
    path,
    selectedImage,
    setSelectedImage,
    selectedItem,
    locations,
}: InventoryFormSubmitProps) => {
    if (type === 'create') {
        await createInventoryItem(body).then((d) => {
            const location = d.location === null ? '-' : `${d.location.name}`;
            const newInventory = {
                ...d,
                type: d.type.name,
                location: location,
            };

            setInventoryData((inventory) => [...inventory, newInventory]);
            setVisible(false);
            revalidate(path);
            try {
                selectedImage.forEach(async (i) => {
                    await uploadInventoryPhoto(
                        d.id,
                        // @ts-ignore
                        i.img
                    );
                });
            } catch (e) {
                return e;
            } finally {
                setSelectedImage(undefined);
            }
        });
    } else {
        await updateInventoryItem(selectedItem?.id as number, body).then(
            (d) => {
                setInventoryData((inventory) => {
                    return inventory.map((el) => {
                        if (el.id === selectedItem?.id) {
                            return {
                                ...el,
                                type: d?.type?.name,
                                location: locations.find(
                                    (el) => el.id === +d.location
                                )?.name as string,
                            };
                        }
                        return el;
                    });
                });
                revalidate(path);
                setVisible(false);
            }
        );
    }
};
