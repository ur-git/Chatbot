import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import {
  RobotOutline,
  SendOutline,
  StarOutline,
  UserOutline,
  SettingOutline,
  ArrowLeftOutline,
  DragOutline
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
  SendOutline,
  RobotOutline,
  StarOutline,
  UserOutline,
  SettingOutline,
  ArrowLeftOutline,
  DragOutline
];

export function provideNzIcons(): EnvironmentProviders {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
