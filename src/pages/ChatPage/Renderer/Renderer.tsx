import InteractiveProduct, {
  type ProductFeedbackPayload,
} from "@/components/a2ui/InteractiveProduct";
import ProcessingStatus from "@/components/a2ui/ProcessingStatus";
import Questionnaire from "@/components/a2ui/Questionnaire";
import type { A2UIPayload } from "@/types/a2ui.types";
import React from "react";

interface A2UIRendererProps {
  a2uiPayload: A2UIPayload;
  onSendHiddenMessage: (action: string, payload: unknown) => void;
}

export const A2UIRenderer: React.FC<A2UIRendererProps> = ({
  a2uiPayload,
  onSendHiddenMessage,
}) => {
  switch (a2uiPayload.type) {
    case "a2ui_questionnaire":
      return (
        <Questionnaire
          title={a2uiPayload.data.title}
          options={a2uiPayload.data.options}
          allowMultiple={a2uiPayload.data.allowMultiple}
          onSubmit={(selectedIds) =>
            onSendHiddenMessage("SUBMIT_SURVEY", selectedIds)
          }
        />
      );

    case "a2ui_interactive_product":
      return (
        <InteractiveProduct
          product={a2uiPayload.data.product}
          reasonsToReject={a2uiPayload.data.reasonsToReject}
          onFeedback={(feedback: ProductFeedbackPayload) =>
            onSendHiddenMessage("PRODUCT_FEEDBACK", feedback)
          }
        />
      );

    case "a2ui_processing_status":
      return (
        <ProcessingStatus
          text={a2uiPayload.data.statusText}
          percent={a2uiPayload.data.progressPercent}
        />
      );

    case "a2ui_done":
      return (
        <div
          className="a2ui-done-badge"
          style={{ color: "green", fontSize: "14px" }}
        >
          ✓ Đã hoàn tất phân tích
        </div>
      );

    default:
      return null;
  }
};
