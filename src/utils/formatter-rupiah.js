import numeral from 'numeral';

numeral.register('locale', 'id', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'RB',
        million: 'JT',
        billion: 'M',
        trillion: 'T'
    },
    currency: {
        symbol: 'Rp. '
    }
})

numeral.locale('id');

export const currency = (number) => {
    return numeral(number).format('$0,0');
}