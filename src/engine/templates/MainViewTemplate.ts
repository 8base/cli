export const buildTemplateMainView = (
  moduleName: string,
  titleRows: string,
  rows: string,
) => {
  return `
        import {
          Button,
          Card,
          CardContent,
          Grid,
          Table,
          TableBody,
          TableContainer,
          TableHead,
          TableRow,
        } from '@mui/material';
        import AddIcon from '@mui/icons-material/Add';
        import { Box } from '@mui/system';
        import React, { useState } from 'react';
        import {
          DefaultRowSize,
          TableToolbar,
        } from '../../shared/components/table/TableToolbar';
        import { usePagination } from '../../shared/hooks/hooks';
        import { FilterMenu } from '../../shared/components/FilterMenu';
        import { PaperStyled } from '../../shared/components/card/Card';
        import { StyledTableCell } from '../../shared/components/table/TableRowStyled';
        import { TableRowLoading } from '../../shared/components/table/TableRowLoading';
        import { Pagination } from '../../shared/components/table/Pagination';
        import { makeStyles } from '@mui/styles';
        import { useNavigate } from 'react-router-dom';

        const useStyles = makeStyles(() => ({
          card: {
            background: '#fff',
            borderRadius: '8px',
          },
        }));
        /**
         * @returns {JSX.Element} - View component.
         */
        export const ${moduleName}View: React.FC = () => {
          const [loading] = useState(false);
          const navigate = useNavigate();
          const classes = useStyles();
          const [{ page, pageSize }, setPage] = usePagination({
            deafultPage: 1,
            deafultPageSize: 10,
          });
          return (
            <>
              <Box padding="0px 50px">
                <Card className={classes.card}>
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <TableToolbar
                          defaultRow={pageSize as DefaultRowSize}
                          rightComponent={
                            <Button
                              style={{ textTransform: 'none' }}
                              variant="contained"
                              onClick={() => navigate('/${moduleName}/create')}
                              sx={{
                                background: '#005A42',
                                width: {
                                  xs: '100%',
                                  md: 'auto',
                                },
                              }}
                              startIcon={<AddIcon />}>
                              create ${moduleName}
                            </Button>
                          }
                          menuButtonComponent={
                            <FilterMenu onCancel={() => {}} onApply={() => {}} />
                          }
                        />
                      </Grid>
                      <Grid item md={12}>
                        <TableContainer component={PaperStyled}>
                          <Table sx={{ minWidth: 650, marginTop: '30px' }}>
                            <TableHead sx={{ whiteSpace: 'nowrap' }}>
                              <TableRow>
                               ${titleRows}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {loading && ![].length && (
                                <TableRowLoading loading={loading} colSpan={9} />
                              )}
                              <TableRow
                                sx={{
                                  borderBottom: '0px',
                                  borderStyle: 'none',
                                  cursor: 'pointer',
                                }}
                                onClick={() => navigate('/${moduleName}/details/123')}
                                hover>
                                ${rows}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Pagination
                          page={page}
                          pageSize={pageSize}
                          totalCount={0}
                          onChange={(value) => setPage({ page: value })}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </>
          );
        };
        `;
};
