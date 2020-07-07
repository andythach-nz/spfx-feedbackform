import { WebPartContext } from "@microsoft/sp-webpart-base";

import {
  sp,
  ItemAddResult,
  PermissionKind,
  SearchSuggestQuery,
  SearchSuggestResult
} from "@pnp/sp";

import {
  SPHttpClient,
  HttpClient,
  IHttpClientOptions
} from "@microsoft/sp-http";
import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";

export class SharePointServiceManager {
  public context: WebPartContext;

  public setup(context: WebPartContext): void {
    console.log("context", context);
    this.context = context;
  }

  public pnp_setup(content: WebPartContext): void {
    sp.setup({ spfxContext: content });
  }

  public pnp_addItem = async (listTitle: string, itemObject: {}) => {
    const result: ItemAddResult = await sp.web.lists
      .getByTitle(listTitle)
      .items.add(itemObject);
    return result;
  };

  public pnp_getUserProfileProperty = async (
    loginName: string,
    propName: string
  ) => {
    return await sp.profiles.getUserProfilePropertyFor(loginName, propName);
  };

  public pnp_getListItems = async (listTitle: string): Promise<any> => {
    try {
      return sp.web.lists.getByTitle(listTitle).items.get();
    } catch (error) {
      throw error;
    }
  };
}

const SharePointService = new SharePointServiceManager();

export default SharePointService;
