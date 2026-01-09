import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    colors: {
        brand: {
            50: '#E8F2FF',
            100: '#C6DFFF',
            200: '#A3CCFF',
            300: '#80B9FF',
            400: '#5DA6FF',
            500: '#4A90E2', // Professional Blue
            600: '#3A7BC8',
            700: '#2A66AE',
            800: '#1A5194',
            900: '#0A3C7A',
        },
        accent: {
            50: '#FFF5D6',
            100: '#FFE6AD',
            200: '#FFD785',
            300: '#FFC85C',
            400: '#FFB933',
            500: '#FFB900', // Gold
            600: '#E6A800',
            700: '#CC9600',
            800: '#B38500',
            900: '#997400',
        },
    },
    fonts: {
        heading: `'Inter', sans-serif`,
        body: `'Inter', sans-serif`,
    },
    styles: {
        global: (props) => ({
            body: {
                bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
                color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
            },
        }),
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'bold',
                borderRadius: 'lg',
            },
            variants: {
                solid: (props) => ({
                    bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
                }),
            },
        },
        Card: {
            baseStyle: (props) => ({
                container: {
                    borderRadius: 'xl',
                    boxShadow: 'sm',
                    overflow: 'hidden',
                    bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
                    border: '1px solid',
                    borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
                },
            }),
        },
    },
});

export default theme;
