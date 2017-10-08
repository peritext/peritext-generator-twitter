import Cite from 'citation-js';

export default (item, loc) => {
    const cit = new Cite(item, {
        format: 'string',
        type: 'bibtex',
    });
    return cit.get({
        format: 'string',
        type: 'html',
        style: 'citation-apa',
        append: ' ' + loc,
        lang: 'fr-FR',
    });
}