import { IFeedbackField } from "./IFeedbackField";

export interface IFeedbackForm {
  feedbackListName: string;
  feedbackFields: IFeedbackField[];
  activateForm: boolean;
}
