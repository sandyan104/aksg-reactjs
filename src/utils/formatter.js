import parse from 'date-fns/parse';
import format from 'date-fns/format';
// import parseISO from 'date-fns/parseISO';
import idLocale from 'date-fns/locale/id';

export const unixToDate = (unix) => {
    return format(parse(unix, 'T', new Date()), "dd/MM/yyy HH.MM")
}
export const unixToDate2 = (unix) => {
    return format(parse(unix, 'T', new Date()), "dd/MM/yyy")
}
export const unixToDate3 = (unix) => {
    return format(parse(unix, 'T', new Date()), "dd MMMM yyyy HH.MM", {locale: idLocale})
}