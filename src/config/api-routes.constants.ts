import { environment } from "./../environments/environment";

// tslint:disable-next-line: no-big-function
export const API_ROUTES = () => {
  const getApiEndPoint = () => environment.apiEndPoint;

  const routes = {
    Module_Name: {
      component_name: () => `${getApiEndPoint()}/comp`
    }
  };
  if (environment.local) {
    routes.Module_Name.component_name = () => `${getApiEndPoint()}/comp.json`;
  }
  return routes;
}
