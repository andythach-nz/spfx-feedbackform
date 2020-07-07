import * as React from "react";
import { IFeedbackformPageFillWebPartProps } from "../FeedbackformPageFillWebPart";
import { FeedbackForm } from "./FeedbackForm";
import { FeedbackformPageFill } from "./FeedbackformPageFill";
import { IFeedbackForm } from "../interface/IFeedbackForm";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { IFeedbackPlaceHolderProps } from "../interface/IFeedbackPlaceHolderProps";

export const FeedbackPlaceholder: React.FC<IFeedbackPlaceHolderProps> = props => {
  console.log("props page fill", props.feedbackForm);
  console.log("activateForm?", props.feedbackForm.activateForm);
  const getJSX = (): JSX.Element => {
    return props.feedbackForm.feedbackFields.length > 4 ? (
      <FeedbackformPageFill {...props} />
    ) : (
      <Placeholder
        iconName="Edit"
        iconText="Configure Feedback Form"
        description="Provide field names for form to render."
        buttonLabel="Configure"
        onConfigure={props.onConfigure}
      />
    );
  };
  return getJSX();
};
