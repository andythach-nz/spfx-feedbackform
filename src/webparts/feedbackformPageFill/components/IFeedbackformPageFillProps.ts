import { IFeedbackForm } from "../interface/IFeedbackForm";

export interface IFeedbackformPageFillProps {
  feedbackFormSettings?: IFeedbackForm;
  onConfigure: () => void;
}
