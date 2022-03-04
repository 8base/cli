import  * as ejs from 'ejs';

// @ts-ignore
const  createEditComponents = '';
// @ts-ignore
const  fieldsInputsList = '';
// @ts-ignore
const  fieldsQueries = './fieldsQueries.js.ejs';
// @ts-ignore
const  routeComponent = './routeComponent.js.ejs';
// @ts-ignore
const  routeconst  = './routeconst .js.ejs';
// @ts-ignore
const  routeLink = './routeLink.js.ejs';

export const chunks = {
  createEditComponents: (data?: { [key: string]: any }) => ejs.render(createEditComponents, data),
  fieldsInputsList: (data?: { [key: string]: any }) => ejs.render(fieldsInputsList, data),
  fieldsQueries: (data?: { [key: string]: any }) => ejs.render(fieldsQueries, data),
  routeComponent: (data?: { [key: string]: any }) => ejs.render(routeComponent, data),
  routeconst : (data?: { [key: string]: any }) => ejs.render(routeconst , data),
  routeLink: (data?: { [key: string]: any }) => ejs.render(routeLink, data),
};
