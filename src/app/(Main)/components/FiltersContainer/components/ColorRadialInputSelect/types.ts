export interface ColorRadialInputSelectProps {
    value: string;
    handleDeleteOne: (id: number) => void;
    listValues: { id: number; name: string }[];
    onChange: (item: any) => void;
    label?: string;
    bgColor?: string;
    selectedValues?: { id: number; name: string }[];
    placeholder?: string;
    showPrevValue?: boolean;
}
