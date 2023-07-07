export const selectStyles = {
    valueContainer: (base: any, state: any) => ({
        ...base,
        // background: state.isSelected ? 'red' : 'white',
        padding: '0px',
        margin: '0px',
        // width: '100%',
        // display: 'flex',
    }),
    input: (base: any, state: any) => ({
        ...base,
    }),
    placeholder: (base: any, state: any) => ({
        ...base,
        color: '#a1a1a1',
        fontFamily: 'Montserrat-Medium',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '145%',
        letterSpacing: '-0.01em',
    }),
    multiValue: (base: any, state: any) => ({
        ...base,
        background: '#308D92',
        // color: 'var(--text-color)',
        padding: '5px 8px',
        borderRadius: '12px',
        fontSize: '20px',
        color: '#fff',
        // maxWidth: '220px',
        // width: '100%',
    }),
    multiValueLabel: (base: any, state: any) => ({
        ...base,
        width: '100%',
        color: '#fff',
    }),
    multiValueRemove: (base: any, state: any) => ({
        ...base,
        maxWidth: '25px',
    }),
    control: (base: any, state: any) => ({
        ...base,
        borderColor: state.isSelected && 'var(--text-color)',
        padding: '10px 17px',
        borderRadius: '12px',
        background: '#F7F7F7',
        // width: '100%',
        // display: 'flex',
    }),
    // noOptionsMessage: (base: any, state: any) => ({
    //     ...base,
    //     background: 'red',
    // }),
    // loadingMessage: (base: any, state: any) => ({
    //     ...base,
    //     background: '#fff',
    // }),
    container: (base: any, state: any) => ({
        ...base,
        width: '100%',
    }),
    menu: (base: any, state: any) => ({
        ...base,
        width: '100%',
    }),
    menuList: (base: any, state: any) => ({
        ...base,
        flexDirection: 'column',
        color: 'black',
        fontSize: '16px',
    }),
    indicatorsContainer: (base: any, state: any) => ({
        ...base,
        // paddingLeft: '15px',
        // background: 'blue',
        maxWidth: '85px',
        justifyContent: 'flex-end',

        // width: '100%',
    }),

    indicatorSeparator: (base: any, state: any) => ({
        ...base,
        display: 'none',
    }),

    dropdownIndicator: (base: any, state: any) => ({
        ...base,
        background: '#31d79b',
        marginLeft: '15px',
        borderRadius: '12px',
        maxWidth: '35px',
        float: 'right',
    }),
    option: (base: any, state: any) => ({
        ...base,
        padding: '10px 17px',
        background: state.isFocused ? '#31d79b' : '#fff',
        color: 'black',
    }),
}

export const headerSelectStyles = {
    ...selectStyles,
    control: (base: any, state: any) => ({
        ...base,
        borderColor: state.isSelected && 'var(--text-color)',
        padding: '5px 10px',
        borderRadius: '12px',
        background: '#F7F7F7',
        // width: '100%',
        // display: 'flex',
    }),
}

export const fileSelectStyles = {
    ...selectStyles,
    control: (base: any, state: any) => ({
        ...base,
        borderColor: state.isSelected && 'var(--text-color)',
        padding: '5px',
        borderRadius: '10px',
        background: '#F7F7F7',
        // width: '100%',
        // display: 'flex',
    }),
    // dropdownIndicator: (base: any, state: any) => ({
    //     ...base,
    //     background: '#31d79b',
    //     marginLeft: '15px',
    //     borderRadius: '10px',
    //     maxWidth: '25px',
    //     maxHeight: '25px',
    //     // float: 'right',
    // }),
}

// export const elementSelectStyles = {
//     ...selectStyles,
//     // control: (base: any, state: any) => ({
//     //     ...base,
//     //     // borderColor: state.isSelected && 'var(--text-color)',
//     //     // padding: '5px',
//     //     // borderRadius: '10px',
//     //     // background: '#F7F7F7',
//     //     // width: '100%',
//     //     // display: 'flex',
//     // }),
//     control: (base: any, state: any) => ({
//         ...base,
//         borderColor: state.isSelected && 'var(--text-color)',
//         padding: '10px 17px',
//         borderRadius: '12px',
//         background: '#F7F7F7',
//         // width: '100%',
//         // display: 'flex',
//     }),
// }

export const themeUnset = (theme: any) => ({
    ...theme,
    colors: {
        // ...theme.colors
        primary: 'unset',
        primary25: 'unset',
        neutral0: '#fff', // menu background
        neutral20: 'unset',
        neutral50: 'black', // input text
        neutral80: 'black', // cursor
        primary75: 'unset',
        danger: 'unset',
        neutral5: 'unset',
        neutral30: 'unset',
        neutral60: 'unset',
        neutral90: 'unset',
        primary50: 'unset',
        dangerLight: 'unset',
        neutral10: 'unset',
        neutral40: 'unset',
        neutral70: 'unset',
    },
})
