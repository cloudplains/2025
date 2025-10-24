import BookModel from "../../../models/Book";
import NoteModel from "../../../models/Note";
import BookmarkModel from "../../../models/Bookmark";
import PluginModel from "../../../models/Plugin";
import { RouteComponentProps } from "react-router-dom";
export interface SettingInfoProps extends RouteComponentProps<any> {
  handleSetting: (isSettingOpen: boolean) => void;
  handleSettingMode: (settingMode: string) => void;
  handleSettingDrive: (settingDrive: string) => void;
  handleTokenDialog: (isOpenTokenDialog: boolean) => void;
  handleFetchDataSourceList: () => void;
  handleFetchDefaultSyncOption: () => void;
  handleFetchLoginOptionList: () => void;
  handleLoginOptionList: (
    loginOptionList: { email: string; provider: string }[]
  ) => void;
  handleFetchAuthed: () => void;
  handleLoadingDialog: (isShow: boolean) => void;
  t: (title: string) => string;
  handleFetchBooks: () => void;
  handleFetchPlugins: () => void;
  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  isOpenTokenDialog: boolean;
  plugins: PluginModel[];
  books: BookModel[];
  userInfo: any;
  dataSourceList: string[];
  loginOptionList: { email: string; provider: string }[];
  defaultSyncOption: string;
  isAuthed: boolean;
  settingMode: string;
  settingDrive: string;
}
export interface SettingInfoState {
  isPreventTrigger: boolean;
  appSkin: string;
  storageLocation: string;
  isOpenBook: boolean;
  isDisablePopup: boolean;
  isDeleteShelfBook: boolean;
  isOpenInMain: boolean;
  isPrecacheBook: boolean;
  isUseBuiltIn: boolean;
  isDisablePDFCover: boolean;
  isHideShelfBook: boolean;
  isPreventAdd: boolean;
  isAddNew: boolean;
  currentThemeIndex: number;
  driveConfig: any;
  loginConfig: any;
  settingLogin: string;
}
