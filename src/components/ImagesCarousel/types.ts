interface ImageCarouselProps {
    images:
        | {
              id: number;
              image: string;
          }[]
        | null;
    loading: boolean;
}

interface ImageCarouselItemProps {
    item: { id: number; image: string };
}
interface ImageCarouselItemFullProps {
    item: { id: number; image: string };
    setFullView: (v: boolean) => void;
}
