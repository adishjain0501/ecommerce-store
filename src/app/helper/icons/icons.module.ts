import { NgModule } from '@angular/core';
import { IconBuildingStore, IconCategory, IconCirclePlus, IconHomeCheck, IconLogout2, IconSquareRoundedPlus, IconTruckDelivery, IconUserCheck, IconUsersGroup } from 'angular-tabler-icons/icons';
import { TablerIconsModule } from 'angular-tabler-icons';

const icons = {
  IconHomeCheck,
  IconCirclePlus,
  IconBuildingStore,
  IconCategory,
  IconSquareRoundedPlus,
  IconUsersGroup,
  IconTruckDelivery,
  IconLogout2,
  IconUserCheck
};


@NgModule({
  declarations: [],
  imports: [
    TablerIconsModule.pick(icons)
  ],
  exports: [
    TablerIconsModule
  ]
})
export class IconsModule { }
