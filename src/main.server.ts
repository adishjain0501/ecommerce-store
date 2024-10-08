import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => {
  console.log('in main server ts inside bootstrap function');
  return bootstrapApplication(AppComponent, config);
};
console.log('in main server ts');
export default bootstrap;
