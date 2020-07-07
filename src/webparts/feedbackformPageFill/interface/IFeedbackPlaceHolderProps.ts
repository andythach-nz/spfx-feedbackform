import { IFeedbackForm } from "./IFeedbackForm";

export interface IFeedbackPlaceHolderProps {
  feedbackForm?: IFeedbackForm | undefined;
  onConfigure: () => void;
}
