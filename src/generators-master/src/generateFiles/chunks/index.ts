import * as ejs from 'ejs';

// @ts-ignore
import createEditComponents from './createEditComponents.js.ejs';
// @ts-ignore
import fieldsInputsList from './fieldsInputsList.js.ejs';
// @ts-ignore
import fieldsQueries from './fieldsQueries.js.ejs';
// @ts-ignore
import routeComponent from './routeComponent.js.ejs';
// @ts-ignore
import routeImport from './routeImport.js.ejs';
// @ts-ignore
import routeLink from './routeLink.js.ejs';

export const chunks = {
  createEditComponents: (data?: { [key: string]: any }) => ejs.render(createEditComponents, data),
  fieldsInputsList: (data?: { [key: string]: any }) => ejs.render(fieldsInputsList, data),
  fieldsQueries: (data?: { [key: string]: any }) => ejs.render(fieldsQueries, data),
  routeComponent: (data?: { [key: string]: any }) => ejs.render(routeComponent, data),
  routeImport: (data?: { [key: string]: any }) => ejs.render(routeImport, data),
  routeLink: (data?: { [key: string]: any }) => ejs.render(routeLink, data),
};
