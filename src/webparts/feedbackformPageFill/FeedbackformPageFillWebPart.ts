import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  PropertyPaneToggle
} from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-property-pane";
import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType
} from "@pnp/spfx-property-controls/lib/PropertyFieldCollectionData";
import * as strings from "FeedbackformPageFillWebPartStrings";
import { FeedbackPlaceholder } from "./components/FeedbackPlaceholder";
import SharePointService from "./services/SharePointService";
import { IFeedbackField } from "./interface/IFeedbackField";
import { IFeedbackPlaceHolderProps } from "./interface/IFeedbackPlaceHolderProps";

export interface IFeedbackformPageFillWebPartProps {
  feedbackListName: string;
  feedbackFields: IFeedbackField[];
  activateForm: boolean;
}

export default class FeedbackformPageFillWebPart extends BaseClientSideWebPart<
  IFeedbackformPageFillWebPartProps
> {
  public render(): void {
    const { feedbackFields, feedbackListName, activateForm } = this.properties;
    console.log("activateForm", activateForm);
    const element: React.ReactElement<IFeedbackPlaceHolderProps> = React.createElement(
      FeedbackPlaceholder,
      {
        feedbackForm: activateForm
          ? {
              feedbackListName,
              feedbackFields,
              activateForm
            }
          : {
              feedbackListName,
              feedbackFields,
              activateForm
            },
        onConfigure: this.onConfigure
      }
    );
    SharePointService.setup(this.context);
    SharePointService.pnp_setup(this.context);
    ReactDom.render(element, this.domElement);
  }

  public onConfigure = (): void => {
    this.context.propertyPane.open();
  };

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const { feedbackListName, feedbackFields, activateForm } = this.properties;
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField("feedbackListName", {
                  label: "Feedback list name",
                  value: feedbackListName
                }),
                PropertyFieldCollectionData("feedbackFields", {
                  key: "feedbackFields",
                  label: "Configure your fields",
                  panelHeader: "Configure internal column names for:",
                  manageBtnLabel: "Configure feedback",
                  value: feedbackFields,
                  fields: [
                    {
                      id: "title",
                      title: "Title",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "internalColumnName",
                      title: "Internal column name",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "type",
                      title: "Type",
                      type: CustomCollectionFieldType.dropdown,
                      options: [
                        {
                          key: "text",
                          text: "Text"
                        },
                        {
                          key: "dropDown",
                          text: "Drop Down"
                        }
                      ],
                      required: true
                    },
                    {
                      id: "inputDisabled",
                      title: "Input Disabled",
                      type: CustomCollectionFieldType.boolean
                    },
                    {
                      id: "valueMarker",
                      title: "Value Marker",
                      type: CustomCollectionFieldType.dropdown,
                      options: [
                        {
                          key: "displayName",
                          text: "Display User Name"
                        },
                        {
                          key: "email",
                          text: "Display User Email"
                        },
                        {
                          key: "department",
                          text: "User Department"
                        },
                        {
                          key: "feedbackType",
                          text: "Feedback Type"
                        },
                        {
                          key: "feedbackCategory",
                          text: "Feedback Category"
                        }
                      ],
                      required: true
                    }
                  ],
                  disabled: false
                }),
                PropertyPaneToggle("activateForm", {
                  label: `${activateForm ? "Hide" : "Show"} feedback from`,
                  checked: activateForm,
                  disabled: !feedbackListName || !feedbackFields,
                  offText: " ",
                  onText: " "
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
