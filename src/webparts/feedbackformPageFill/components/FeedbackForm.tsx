import * as React from "react";
import {
  PrimaryButton,
  TextField,
  Panel,
  PanelType,
  Label,
  Image,
  Dropdown,
  IDropdownOption,
  Stack,
  Modal,
  SwatchColorPicker
} from "office-ui-fabric-react";
import {
  FilePicker,
  IFilePickerResult
} from "@pnp/spfx-controls-react/lib/FilePicker";
import { useId, useBoolean } from "@uifabric/react-hooks";
import { sp, AttachmentFileInfo } from "@pnp/sp";
const formImage: string = require("../images/FormResource.png");
import { IFeedbackFormProps } from "../interface/IFeedbackFormProps";
import SharePointService from "../services/SharePointService";

export const FeedbackForm = ({
  feedbackFormSettings
}: IFeedbackFormProps): JSX.Element => {
  console.log("feedbacksettings FeedBACKForm", feedbackFormSettings);
  const formImage: string = require("../images/FormResource.png");
  const titleId = useId("title");
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(
    false
  );
  const [feedbackValues, setFeedbackValues] = React.useState<
    string | undefined
  >(undefined);
  const [feedbackDocValues, setFeedbackDocValues] = React.useState<
    string | undefined
  >(undefined);
  const [feedbackTypeOptions, setFeedbackTypeOptions] = React.useState<
    IDropdownOption[]
  >();
  const [feedbackCategoryOptions, setFeedbackCategoryOptions] = React.useState<
    IDropdownOption[]
  >();
  const [listOfAttachments, setListOfAttachments] = React.useState<
    AttachmentFileInfo[]
  >([]);

  const [feedbackFormValues, setfeedbackFormValues] = React.useState({
    Title: "",
    Email: "",
    Department: "",
    FeedbackType: "",
    FeedbackCategory: "",
    Feedback: "",
    DocumentFeedback: "",
    feedbackTypeSelectionKeys: [],
    feedbackCategorySelectionKeys: []
  });

  const getFeedbackTypes = async (): Promise<any> => {
    try {
      const results = await SharePointService.pnp_getListItems(
        "LOOKUPFeedbackType"
      );
      console.log("LOOKUPFeedbackType Res", results);
      return results;
    } catch (error) {
      throw error;
    }
  };

  const getFeedbackCategories = async (): Promise<any> => {
    try {
      return await SharePointService.pnp_getListItems("LOOKUPFeedbackCategory");
    } catch (error) {
      throw error;
    }
  };

  React.useEffect(() => {
    const loginName =
      "i:0#.f|membership|" +
      SharePointService.context.pageContext.user.loginName;
    SharePointService.pnp_getUserProfileProperty(loginName, "Department").then(
      res => {
        setfeedbackFormValues({
          Title: SharePointService.context.pageContext.user.displayName,
          Email: SharePointService.context.pageContext.user.email,
          Department: res,
          FeedbackType: "",
          FeedbackCategory: "",
          Feedback: "",
          DocumentFeedback: "",
          feedbackTypeSelectionKeys: [],
          feedbackCategorySelectionKeys: []
        });
      }
    );
  }, []);

  React.useEffect(() => {
    getFeedbackTypes().then(r => {
      const typeResults = r.map(item => ({
        key: item.Title,
        text: item.Title
      }));

      setFeedbackTypeOptions(typeResults);
    });
  }, []);

  React.useEffect(() => {
    getFeedbackCategories().then(res => {
      const categoryResults = res.map(item => ({
        key: item.Title,
        text: item.Title
      }));

      setFeedbackCategoryOptions(categoryResults);
    });
  }, []);

  const _handleOnChange = (e: any, inputValue: IDropdownOption, index: any) => {
    const currentId = e.target["id"] as string;
    if (currentId === "feedbackTypeSelectionKeys") {
      console.log("feedbackTypeSelectionKeys", currentId);
      let tempArray = feedbackFormValues["feedbackTypeSelectionKeys"];
      if (inputValue.selected) {
        tempArray.push(inputValue.key);
        // setfeedbackFormValues({ ...feedbackFormValues });
      } else {
        tempArray = feedbackFormValues["feedbackTypeSelectionKeys"].filter(
          t => t !== inputValue.key
        );
      }

      setfeedbackFormValues({
        ...feedbackFormValues,
        feedbackTypeSelectionKeys: tempArray
      });
    } else if (currentId === "feedbackCategorySelectionKeys") {
      console.log("feedbackCategorySelectionKeys", currentId);
      let tempCategoryArray =
        feedbackFormValues["feedbackCategorySelectionKeys"];

      if (inputValue.selected) {
        tempCategoryArray.push(inputValue.key);

        // setfeedbackFormValues({ ...feedbackFormValues });
      } else {
        tempCategoryArray = feedbackFormValues[
          "feedbackCategorySelectionKeys"
        ].filter(t => t !== inputValue.key);
      }

      setfeedbackFormValues({
        ...feedbackFormValues,
        feedbackCategorySelectionKeys: tempCategoryArray
      });
    }
  };

  const _handleFileAttachment = async (filePickerResult: IFilePickerResult) => {
    if (filePickerResult.fileAbsoluteUrl == null) {
      filePickerResult.downloadFileContent().then(async fileR => {
        //setFileAttachment(res);
        listOfAttachments.push({ name: fileR.name, content: fileR });
        setListOfAttachments(listOfAttachments);
        alert("File " + fileR.name + " uploaded successfully.");
      });
    }
  };

  const _onSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    let clear = "";
    const submitObj = feedbackFormValues;
    const optionTypeValues = submitObj.feedbackTypeSelectionKeys.join(";");
    const optionCategoryValues = submitObj.feedbackCategorySelectionKeys.join(
      ";"
    );
    submitObj.FeedbackType = optionTypeValues;
    submitObj.FeedbackCategory = optionCategoryValues;
    delete submitObj.feedbackTypeSelectionKeys;
    delete submitObj.feedbackCategorySelectionKeys;
    try {
      const itemResult = await SharePointService.pnp_addItem(
        feedbackFormSettings.feedbackListName,
        submitObj
      );
      //handle attachments
      itemResult.item.attachmentFiles.addMultiple(listOfAttachments);
    } catch (error) {
      throw error;
    } finally {
      //feedbackFormValues.feedbackTypeSelectionKeys = new Array();
      //feedbackFormValues.feedbackCategorySelectionKeys = new Array();
      setfeedbackFormValues({
        ...feedbackFormValues,
        FeedbackType: "",
        FeedbackCategory: "",
        Feedback: "",
        DocumentFeedback: "",
        feedbackTypeSelectionKeys: [],
        feedbackCategorySelectionKeys: []
      });
      setFeedbackValues("");
      setFeedbackDocValues("");
      setListOfAttachments(null);
      alert("Your form has been submitted successfully.");
      history.go(-1);
      //window.location.href = document.referrer;
      //showModal;
    }
  };

  const _onRenderDisplayFormFields = (): JSX.Element[] => {
    return feedbackFormSettings.feedbackFields.map(row => {
      if (row.valueMarker === "displayName") {
        return (
          <div style={{ display: "flex" }}>
            <Label style={{ fontWeight: 500, paddingRight: "5px" }}>
              Name:{" "}
            </Label>
            <Label>
              {SharePointService.context.pageContext.user.displayName}
            </Label>
          </div>
        );
      } else if (row.valueMarker === "email") {
        return (
          <div style={{ display: "flex" }}>
            <Label style={{ fontWeight: 500, paddingRight: "5px" }}>
              Email:{" "}
            </Label>
            <Label>{SharePointService.context.pageContext.user.email}</Label>
          </div>
        );
      } else if (row.valueMarker === "department") {
        return (
          <div style={{ display: "flex" }}>
            <Label style={{ fontWeight: 500, paddingRight: "5px" }}>
              Department:{" "}
            </Label>
            <Label>{feedbackFormValues.Department}</Label>
          </div>
        );
      } else if (row.valueMarker === "feedbackType") {
        return (
          <Dropdown
            multiSelect
            placeholder="Select an option"
            label="Type of Feedback"
            id="feedbackTypeSelectionKeys"
            options={feedbackTypeOptions}
            onChange={_handleOnChange}
            selectedKeys={[...feedbackFormValues.feedbackTypeSelectionKeys]}
          />
        );
      } else if (row.valueMarker === "feedbackCategory") {
        return (
          <Dropdown
            placeholder="Select an option"
            multiSelect
            label="Feedback Category"
            id="feedbackCategorySelectionKeys"
            options={feedbackCategoryOptions}
            onChange={_handleOnChange}
            selectedKeys={[...feedbackFormValues.feedbackCategorySelectionKeys]}
          />
        );
      }
    });
  };

  return (
    <div>
      <form>
        <Label>
          <div style={{ verticalAlign: "center" }}>
            <Image
              src={formImage}
              width={300}
              height={110}
              styles={{ root: { margin: "0 auto" } }}
            />
            <Label style={{ fontSize: 13, textAlign: "center", margin: 10 }}>
              Hi {SharePointService.context.pageContext.user.displayName}, when
              you submit this form, the owner will be able to see your name and
              email address.
            </Label>
            <br />
          </div>
          <p>
            Thank you for taking the time to submit feedback. Your name, email
            address and feedback will be sent to the relevant owner for
            consideration.
          </p>
          <p>
            Note: For all IT related issues, Australian users contact 1300 333
            000, New Zealand Users contact 0800 156 666 and Spotless Users
            Contact - AU - 1300 333 000, NZ - 0800 487 768
          </p>
        </Label>

        {_onRenderDisplayFormFields()}

        <TextField
          multiline
          label="Document feedback"
          rows={4}
          onChange={(e: any, value?: string) =>
            //console.log("feedback for doc",value)
            setfeedbackFormValues({
              ...feedbackFormValues,
              DocumentFeedback: value
            })
          }
          value={feedbackDocValues}
          placeholder="Your feedback..."
        />

        <TextField
          multiline
          label="Please provide more information"
          rows={6}
          onChange={(e: any, newValue?: string) =>
            setfeedbackFormValues({
              ...feedbackFormValues,
              Feedback: newValue
            })
          }
          value={feedbackValues}
          placeholder="Your feedback..."
        />

        <FilePicker
          bingAPIKey="<BING API KEY>"
          accepts={[
            ".gif",
            ".jpg",
            ".jpeg",
            ".bmp",
            ".dib",
            ".tif",
            ".tiff",
            ".ico",
            ".png",
            ".jxr",
            ".svg"
          ]}
          buttonIcon="FileImage"
          buttonLabel="Upload a File"
          onSave={_handleFileAttachment}
          onChanged={(file?: IFilePickerResult) => {
            _handleFileAttachment(file);
          }}
          context={SharePointService.context}
          label="Please attach file related to this feedback."
        />

        <Stack horizontal horizontalAlign="end">
          <PrimaryButton
            onClick={_onSubmit}
            text="Save"
            disabled={!feedbackFormValues.Feedback}
          />
        </Stack>

        <Modal
          titleAriaId={titleId}
          isOpen={isModalOpen}
          onDismiss={hideModal}
          isModeless={true}
        >
          <span id={titleId}>Lorem Ipsum</span>
        </Modal>
      </form>
    </div>
  );
};
