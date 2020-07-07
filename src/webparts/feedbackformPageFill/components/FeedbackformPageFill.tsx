import * as React from "react";
import { IFeedbackformPageFillProps } from "./IFeedbackformPageFillProps";
import { FeedbackForm } from "../components/FeedbackForm";
import { Stack } from "office-ui-fabric-react";
import { IFeedbackForm } from "../interface/IFeedbackForm";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { IFeedbackPlaceHolderProps } from "../interface/IFeedbackPlaceHolderProps";
export const FeedbackformPageFill: React.FC<IFeedbackPlaceHolderProps> = props => {
  //const [feedbackForm, setFeedbackForm] = React.useState<IFeedbackForm>();
  // console.log("props from page fill 2", props);
  // React.useEffect(() => {
  //   setFeedbackForm(props.feedbackForm);
  // }, []);

  //const { feedbackForm } = React.useContext(FeedbackContext);
  // const feedbackForm: IFeedbackForm = {
  //   feedbackListName: "FeedBack",
  //   feedbackFields: [
  //     {
  //       title: "Title",
  //       columnName: "Title",
  //       valueMarker: "displayName"
  //     },
  //     {
  //       title: "Email",
  //       columnName: "Email",
  //       valueMarker: "email"
  //     },
  //     {
  //       title: "Department",
  //       columnName: "Department",
  //       valueMarker: "department"
  //     },
  //     {
  //       title: "Feedback Type",
  //       columnName: "FeedbackType",
  //       valueMarker: "feedbackType"
  //     },
  //     {
  //       title: "Feedback Category",
  //       columnName: "FeedbackCategory",
  //       valueMarker: "feedbackCategory"
  //     }
  //   ]
  // };

  return (
    <Stack>
      <div
        style={{
          width: "600px",
          padding: "10px",
          boxShadow:
            "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)"
        }}
      >
        <FeedbackForm feedbackFormSettings={props.feedbackForm} />
      </div>
    </Stack>
  );
};
