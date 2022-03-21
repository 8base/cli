export const buildTemplateRouter = (importRoutes: string, routes: string) => {
    return `import React from 'react';
        import { Routes as RoutesComponent, Route } from 'react-router-dom';
        import { ApolloProvider } from '@apollo/client';
        import { Auth } from './modules/auth/Auth';
        import { AuthCallback } from './modules/auth/components/AuthCallback';
        import { Logout } from './modules/auth/Logout';
        import { Session } from './modules/auth/Session';
        import { apolloClient as client } from './shared/apollo';
        import { Auth0ProviderWithHistory } from './modules/auth/Auth0ProviderWithHistory';
        import { Layout } from './shared/components/Layout/Layout';
        import { Redirect } from './shared/components/Redirect';
        import { Dashboard } from './modules/dashboard/DashboardView';
        ${importRoutes}
        /**
         * @returns Routes.
         */
        export const Routes: React.FC = () => {
          return (
            <Auth0ProviderWithHistory>
              <ApolloProvider client={client}>
                <RoutesComponent>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route
                    path="*"
                    element={
                      <Session>
                        <RoutesComponent>
                          <Route path="/logout" element={<Logout />} />
                          <Route
                            path="/dashboard"
                            element={
                              <Layout>
                                <Dashboard />
                              </Layout>
                            }
                          />
                          ${routes}
                          <Route path="/home" element={<Layout>Home</Layout>} />
                          <Route path="/" element={<Redirect to="/dashboard" />} />
                        </RoutesComponent>
                      </Session>
                    }
                  ></Route>
                </RoutesComponent>
              </ApolloProvider>
            </Auth0ProviderWithHistory>
          );
        };
        `;
  };