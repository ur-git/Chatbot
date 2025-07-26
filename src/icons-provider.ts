import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import {
  RobotOutline,
  SendOutline,
  StarOutline,
  UserOutline,
  SettingOutline,
  ArrowLeftOutline,
  DragOutline,
  DownloadOutline,
  BookOutline
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
  SendOutline,
  RobotOutline,
  StarOutline,
  UserOutline,
  SettingOutline,
  ArrowLeftOutline,
  DragOutline,
  DownloadOutline,
  BookOutline
];

export function provideNzIcons(): EnvironmentProviders {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
