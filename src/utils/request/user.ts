import {
  browserName,
  browserVersion,
  isElectron,
  osName,
  osVersion,
} from "react-device-detect";
import {
  ConfigService,
  KookitConfig,
  TokenService,
  UserRequest,
} from "../../assets/lib/kookit-extra-browser.min";
import packageJson from "../../../package.json";
import toast from "react-hot-toast";
import i18n from "../../i18n";
import { handleExitApp } from "./common";
let userRequest: UserRequest | undefined;
export const loginRegister = async (service: string, code: string) => {
  let deviceName = detectBrowser();
  let userRequest = await getUserRequest();
  let timer = setTimeout(() => {
    if (
      ConfigService.getItem("serverRegion") !== "china" &&
      navigator.language === "zh-CN"
    ) {
      toast.error(
        i18n.t(
          "Request timed out, You may change the server region to China to solve the connection issue in mainland China. Go to Settings > Account"
        ),
        { id: "adding-sync-error", duration: 6000 }
      );
      return;
    }
  }, 10000);
  let response = await userRequest.loginRegister({
    code,
    provider: service,
    scope: KookitConfig.LoginAuthRequest[service].extraParams.scope,
    redirect_uri:
      ConfigService.getItem("serverRegion") === "china" &&
      service === "microsoft"
        ? KookitConfig.ThirdpartyConfig.cnCallbackUrl
        : KookitConfig.ThirdpartyConfig.callbackUrl,
    device_name: deviceName,
    device_type: isElectron ? "Desktop" : "Browser",
    device_os: getOSName(),
    locale: navigator.language,
    os_version: getOsVersionNumber(),
    device_uuid: await TokenService.getFingerprint(),
    app_version: packageJson.version,
  });
  clearTimeout(timer);
  if (response.code === 200) {
    await TokenService.setToken("is_authed", "yes");
    await TokenService.setToken("access_token", response.data.access_token);
    await TokenService.setToken("refresh_token", response.data.refresh_token);
  }
  return response;
};
export const getTempToken = async () => {
  let userRequest = await getUserRequest();
  let response = await userRequest.getTempToken();
  if (response.code === 200) {
    return response;
  } else if (response.code === 401) {
    handleExitApp();
    return response;
  } else {
    toast.error(i18n.t("Fetch failed, error code") + ": " + response.msg);
    return response;
  }
};
export const fetchUserInfo = async () => {
  let userRequest = await getUserRequest();
  let response = await userRequest.getUserInfo();
  if (response.code === 401) {
    handleExitApp();
  }
  return response;
};
export const updateUserConfig = async (config: any) => {
  let userRequest = await getUserRequest();
  let response = await userRequest.updateUserConfig(config);
  if (response.code === 200) {
  } else if (response.code === 401) {
    handleExitApp();
  } else {
    toast.error(i18n.t("Setup failed, error code") + ": " + response.msg);
  }
};
export const getUserRequest = async () => {
  if (userRequest) {
    return userRequest;
  }
  userRequest = new UserRequest(TokenService, ConfigService);
  return userRequest;
};
export const resetUserRequest = () => {
  userRequest = undefined;
};
export const getOSName = () => {
  return isElectron ? osName : browserName;
};
export const detectBrowser = () => {
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf("Edg") > -1) {
    return "Microsoft Edge";
  } else if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  } else if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  } else if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } else if (userAgent.indexOf("Opera") > -1) {
    return "Opera";
  } else if (
    userAgent.indexOf("Trident") > -1 ||
    userAgent.indexOf("MSIE") > -1
  ) {
    return "Internet Explorer";
  }

  return "Unknown";
};
export const getOsVersionNumber = (): string => {
  return isElectron ? osVersion : browserVersion;
};
export const resetKoodoSync = (service: string) => {
  if (
    ConfigService.getItem("defaultSyncOption") &&
    ConfigService.getItem("defaultSyncOption") !== service
  ) {
    if (ConfigService.getReaderConfig("isEnableKoodoSync") === "yes") {
      updateUserConfig({
        is_enable_koodo_sync: "no",
      });
      setTimeout(() => {
        updateUserConfig({
          is_enable_koodo_sync: "yes",
        });
      }, 1000);
    }
  }
};
