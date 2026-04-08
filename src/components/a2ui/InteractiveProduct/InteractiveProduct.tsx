import type { CapturedData } from "@/types/product.types";
import { useState } from "react";
import "./InteractiveProduct.scss";

export interface ProductFeedbackPayload {
  decision: "like" | "dislike";
  productId: string;
  reason?: string;
}

interface InteractiveProductProps {
  product: CapturedData;
  reasonsToReject?: string[];
  onFeedback: (feedback: ProductFeedbackPayload) => void;
}

const toProductId = (value: string | number) => String(value);

const DEFAULT_REASONS_TO_REJECT = [
  "Giá",
  "Phong cách",
  "Thương hiệu",
  "Tính năng",
  "Lý do khác...",
];

export default function InteractiveProduct({
  product,
  reasonsToReject = [],
  onFeedback,
}: InteractiveProductProps) {
  const productId = toProductId(product.productId);
  const [mode, setMode] = useState<"choice" | "reasons" | "done">("choice");
  const visibleReasons = reasonsToReject.length
    ? reasonsToReject
    : DEFAULT_REASONS_TO_REJECT;

  const handleLike = () => {
    onFeedback({ decision: "like", productId });
    setMode("done");
  };

  const handleDislike = () => {
    setMode("reasons");
  };

  return (
    <section className="interactive-product">
      <div className="interactive-product__body">
        <img
          src={product.mainImage}
          alt={product.name}
          className="interactive-product__image"
        />

        <div className="interactive-product__meta">
          <span className="interactive-product__platform">
            {product.platform}
          </span>
          <h4 className="interactive-product__name">{product.name}</h4>
          <p className="interactive-product__price">
            {product.priceCurrent.toLocaleString("vi-VN")} {product.currency}
          </p>
          <p className="interactive-product__shop">
            Shop: {product.shop.shopName}
          </p>
          <p className="interactive-product__rating">
            {product.ratingStar.toFixed(1)} sao (
            {product.ratingCount.toLocaleString("vi-VN")} danh gia)
          </p>
        </div>
      </div>

      {mode === "choice" ? (
        <div className="interactive-product__primary-actions">
          <button
            type="button"
            className="interactive-product__btn interactive-product__btn--neutral"
            onClick={handleDislike}
          >
            <span className="interactive-product__btn-icon">✕</span>
            <span>Không quan tâm</span>
          </button>

          <button
            type="button"
            className="interactive-product__btn interactive-product__btn--like"
            onClick={handleLike}
          >
            <span className="interactive-product__btn-icon">✓</span>
            <span>Thêm nội dung như thế này</span>
          </button>
        </div>
      ) : null}

      {mode === "reasons" ? (
        <div className="interactive-product__feedback">
          <h5 className="interactive-product__question">
            Tại sao bạn không thích sản phẩm này?
          </h5>

          <div className="interactive-product__actions">
            {visibleReasons.map((reason) => (
              <button
                key={reason}
                type="button"
                className="interactive-product__btn interactive-product__btn--reason"
                onClick={() => {
                  onFeedback({
                    decision: "dislike",
                    productId,
                    reason,
                  });
                  setMode("done");
                }}
              >
                {reason === "Lý do khác..." ? (
                  <span className="interactive-product__btn-icon">✎</span>
                ) : null}
                <span>{reason}</span>
              </button>
            ))}

            <button
              type="button"
              className="interactive-product__skip"
              onClick={() => {
                onFeedback({
                  decision: "dislike",
                  productId,
                  reason: "skip",
                });
                setMode("done");
              }}
            >
              Bỏ qua
            </button>
          </div>
        </div>
      ) : null}

      {mode === "done" ? (
        <div className="interactive-product__done">Đã ghi nhận lựa chọn</div>
      ) : null}
    </section>
  );
}
