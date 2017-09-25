import { Injectable } from '@angular/core';
import { Cordova, IonicNativePlugin, Plugin } from '@ionic-native/core';

export interface ExtraOptions {
  name?: string;
  value?: any;
  dataType?: string;
  paType?: string;
}

export interface AppLauncherOptions {
  packageName?: string;
  actionName?: string;
  uri?: string;
  dataType?: string;
  extras?: ExtraOptions[];
}

@Plugin({
  pluginName: 'AppLauncher',
  plugin: 'com.hutchind.cordova.plugins.launcher',
  pluginRef: 'plugins.launcher',
  repo: 'https://github.com/nchutchind/App-Launcher-Cordova-Plugin',
  platforms: ['Android', 'iOS']
})
@Injectable()
export class AppLauncher extends IonicNativePlugin {
  @Cordova()
  canLaunch(_options: AppLauncherOptions): Promise<any> { return; }

  @Cordova()
  launch(_options: AppLauncherOptions): Promise<any> { return; }
}