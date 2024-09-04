// we always import environment.ts in the code (which is meant for production) but this file is picked up in development mode as per the configuration mentioned in angular.json file
export const environment = {
    production: false,
    baseUrl: 'http://localhost:9090',
    ROLE_NORMAL_ID: 'awgfasfwsdqtgasfwqgsdtg',
    ROLE_NORMAL_NAME: 'ROLE_NORMAL',
    ROLE_ADMIN_ID: 'wetrsdfwetwfasfwdf',
    ROLE_ADMIN_NAME: 'ROLE_ADMIN',
    MAX_PAGE_SIZE: 9999999
};
