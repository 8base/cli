import { FieldSchema, FIELD_TYPE } from '@8base/utils';

export const mapRoutes = (moduleNames: string[]): string => {
  let routes = '';
  moduleNames.forEach((module) => {
    const moduleNameMayus = module.charAt(0).toUpperCase() + module.slice(1);
    routes += `
    <Route
      path="/${module}"
      element={<Layout><${moduleNameMayus}View /></Layout>}
     />
    <Route
      path="/${module}/create"
      element={<Layout><Create${moduleNameMayus}View /></Layout>}
    />
    <Route
      path="/${module}/update"
      element={<Layout><Update${moduleNameMayus}View /></Layout>}
    />
    <Route
      path="/${module}/details/:id"
      element={<Layout><${moduleNameMayus}DetailsView /></Layout>}
    /> \n
   `;
  });
  return routes;
};

export const mapImportRoutes = (moduleNames: string[]): string => {
  let importRoutes = '';
  moduleNames.forEach((module) => {
    const moduleNameMayus = module.charAt(0).toUpperCase() + module.slice(1);
    importRoutes += `import { ${moduleNameMayus}View } from './modules/${module}/${moduleNameMayus}View';\n
      import { Create${moduleNameMayus}View } from './modules/${module}/components/Create${moduleNameMayus}View';\n
      import { Update${moduleNameMayus}View } from './modules/${module}/components/Update${moduleNameMayus}View';\n
      import { ${moduleNameMayus}DetailsView } from './modules/${module}/components/${moduleNameMayus}DetailsView';\n
      `;
  });
  return importRoutes;
};

export const mapTableRows = (fields: string[], title: boolean) => {
  let rows = '';
  fields.forEach((field) => {
    if (title) {
      rows += `<StyledTableCell>${field}</StyledTableCell> \n`;
    } else {
      rows += `<StyledTableCell>Data</StyledTableCell> \n`;
    }
  });
  return rows;
};

export const mapTextFields = (fields: FieldSchema[]) => {
  let textFields = '';
  fields.forEach((field) => {
    if (field.fieldType === FIELD_TYPE.DATE)
      textFields += `
    <Grid item md={1} />
    <Grid item md={4}>
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Box display="flex" textAlign="center" justifyContent="center">
          <Title>${field.displayName}</Title>
        </Box>
        <Box display="flex" justifyContent="center">
          <CustomInput type='date' style={{ width: '250px', margin: '10px 0px' }} />
        </Box>
      </Box>
    </Grid>
    <Grid item md={1} /> \n`;

    if (field.fieldType === FIELD_TYPE.NUMBER)
      textFields += `
    <Grid item md={1} />
    <Grid item md={4}>
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Box display="flex" textAlign="center" justifyContent="center">
          <Title>${field.displayName}</Title>
        </Box>
        <Box display="flex" justifyContent="center">
          <CustomInput type='number' style={{ width: '250px', margin: '10px 0px' }} />
        </Box>
      </Box>
    </Grid>
    <Grid item md={1} /> \n`;

    textFields += `
    <Grid item md={1} />
    <Grid item md={4}>
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Box display="flex" textAlign="center" justifyContent="center">
          <Title>${field.displayName}</Title>
        </Box>
        <Box display="flex" justifyContent="center">
          <CustomInput style={{ width: '250px', margin: '10px 0px' }} />
        </Box>
      </Box>
    </Grid>
    <Grid item md={1} /> \n`;
  });
  return textFields;
};

export const mapTextFieldsDetails = (fields: string[]) => {
  let textFields = '';

  fields.forEach((field) => {
    textFields += `
    <Grid item md={3}>
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Box display="flex" textAlign="center" justifyContent="center">
          <Title>${field}</Title>
        </Box>
        <Box textAlign="center">Data</Box>
      </Box>
    </Grid> \n `;
  });

  return textFields;
};
