// we always import environment.ts in the code (which is meant for production) but this file is picked up in development mode as per the configuration mentioned in angular.json file
export const environment = {
    production: false,
    baseUrl: 'http://localhost:9090'
};
