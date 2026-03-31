import type { CapturedData } from "@/types/product.types";
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

export default function InteractiveProduct({
  product,
  reasonsToReject = [],
  onFeedback,
}: InteractiveProductProps) {
  const productId = toProductId(product.productId);

  return (
    <section className="interactive-product">
      <header className="interactive-product__header">
        <span className="interactive-product__platform">
          {product.platform}
        </span>
        <h4 className="interactive-product__name">{product.name}</h4>
      </header>

      <div className="interactive-product__body">
        <img
          src={product.mainImage}
          alt={product.name}
          className="interactive-product__image"
        />

        <div className="interactive-product__meta">
          <p className="interactive-product__price">
            {product.priceCurrent.toLocaleString("vi-VN")} {product.currency}
          </p>
          <p className="interactive-product__shop">
            Shop: {product.shop.shopName}
          </p>
          <p className="interactive-product__rating">
            {product.ratingStart.toFixed(1)} sao (
            {product.ratingCount.toLocaleString("vi-VN")} danh gia)
          </p>
        </div>
      </div>

      <div className="interactive-product__actions">
        <button
          type="button"
          className="interactive-product__btn interactive-product__btn--like"
          onClick={() => onFeedback({ decision: "like", productId })}
        >
          Phu hop
        </button>

        {reasonsToReject.map((reason) => (
          <button
            key={reason}
            type="button"
            className="interactive-product__btn interactive-product__btn--dislike"
            onClick={() =>
              onFeedback({
                decision: "dislike",
                productId,
                reason,
              })
            }
          >
            Khong thich: {reason}
          </button>
        ))}
      </div>
    </section>
  );
}
