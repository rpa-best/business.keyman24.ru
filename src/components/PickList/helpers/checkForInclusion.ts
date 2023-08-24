type defaultType = { id: number; type: string };
export function addSelected<T extends defaultType>(arr: T[], elem: T): T[] {
    return arr?.includes(elem)
        ? arr.filter((item) => {
              return item !== elem;
          })
        : [...(arr ?? []), elem];
}
