import {UserPreviewMode} from "../common/UserPreview/UserPreview";

export default class LocalData {
  public userPreviewMode:UserPreviewMode = UserPreviewMode.Default;
  public lastSearch: string[] = [];
}
