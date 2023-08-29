import { DefaultElem } from 'components/PickList/PickList';

export function addSelected(
    arr: DefaultElem[],
    elem: DefaultElem
): DefaultElem[] {
    return arr?.includes(elem)
        ? arr.filter((item) => {
              return item !== elem;
          })
        : [...(arr ?? []), elem];
}
