import { Injectable } from '@angular/core';
import { Cordova, IonicNativePlugin, Plugin } from '@ionic-native/core';

export interface HotCodePushConifg {
  'config-file'?: string;
  'auto-download'?: boolean;
  'auto-install'?: boolean;
}

export interface HotCodePushOptions {
  'config-file'?: string;
  'request-headers'?: any;
}

export interface HotCodeCallback {
  (error: any, data: any): void;
}

@Plugin({
  pluginName: 'HotCodePush',
  plugin: 'cordova-hot-code-push-plugin',
  pluginRef: 'chcp',
  repo: 'https://github.com/nordnet/cordova-hot-code-push',
  platforms: ['Android', 'iOS']
})
@Injectable()
export class HotCodePush extends IonicNativePlugin {
  static error = {
    NOTHING_TO_INSTALL: 1,
    NOTHING_TO_UPDATE: 2,

    FAILED_TO_DOWNLOAD_APPLICATION_CONFIG: -1,
    APPLICATION_BUILD_VERSION_TOO_LOW: -2,
    FAILED_TO_DOWNLOAD_CONTENT_MANIFEST: -3,
    FAILED_TO_DOWNLOAD_UPDATE_FILES: -4,
    FAILED_TO_MOVE_LOADED_FILES_TO_INSTALLATION_FOLDER: -5,
    UPDATE_IS_INVALID: -6,
    FAILED_TO_COPY_FILES_FROM_PREVIOUS_RELEASE: -7,
    FAILED_TO_COPY_NEW_CONTENT_FILES: -8,
    LOCAL_VERSION_OF_APPLICATION_CONFIG_NOT_FOUND: -9,
    LOCAL_VERSION_OF_MANIFEST_NOT_FOUND: -10,
    LOADED_VERSION_OF_APPLICATION_CONFIG_NOT_FOUND: -11,
    LOADED_VERSION_OF_MANIFEST_NOT_FOUND: -12,
    FAILED_TO_INSTALL_ASSETS_ON_EXTERNAL_STORAGE: -13,
    CANT_INSTALL_WHILE_DOWNLOAD_IN_PROGRESS: -14,
    CANT_DOWNLOAD_UPDATE_WHILE_INSTALLATION_IN_PROGRESS: -15,
    INSTALLATION_ALREADY_IN_PROGRESS: -16,
    DOWNLOAD_ALREADY_IN_PROGRESS: -17,
    ASSETS_FOLDER_IN_NOT_YET_INSTALLED: -18,
    NEW_APPLICATION_CONFIG_IS_INVALID: -19
  };

  static event = {
    BEFORE_ASSETS_INSTALLATION: 'chcp_beforeAssetsInstalledOnExternalStorage',
    ASSETS_INSTALLATION_FAILED: 'chcp_assetsInstallationError',
    ASSETS_INSTALLED: 'chcp_assetsInstalledOnExternalStorage',

    NOTHING_TO_UPDATE: 'chcp_nothingToUpdate',
    UPDATE_LOAD_FAILED: 'chcp_updateLoadFailed',
    UPDATE_IS_READY_TO_INSTALL: 'chcp_updateIsReadyToInstall',

    BEFORE_UPDATE_INSTALLATION: 'chcp_beforeInstall',
    UPDATE_INSTALLATION_FAILED: 'chcp_updateInstallFailed',
    UPDATE_INSTALLED: 'chcp_updateInstalled',
    NOTHING_TO_INSTALL: 'chcp_nothingToInstall'
  };

  @Cordova({
    sync: true
  })
  fetchUpdate(_callback: HotCodeCallback, _options?: HotCodePushOptions): void { }

  @Cordova()
  installUpdate(): Promise<any> { return; }

  @Cordova({
    sync: true
  })
  isUpdateAvailableForInstallation(_callback: HotCodeCallback): void { }

  @Cordova({
    sync: true
  })
  getVersionInfo(_callback: HotCodeCallback) { }

  @Cordova()
  configure(_config: HotCodePushConifg): Promise<any> { return; }

  onUpdateInstalled(listener: EventListenerOrEventListenerObject) {
    document.addEventListener(HotCodePush.event.UPDATE_INSTALLED, listener, false);
  }
}