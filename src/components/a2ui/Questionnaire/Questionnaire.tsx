import "./Questionnaire.scss";

interface QuestionnaireProps {
  title: string;
  options: { id: string; label: string }[];
  allowMultiple?: boolean;
  onSubmit: (selectedIds: string | string[]) => void;
}

export default function Questionnaire({
  title,
  options,
  allowMultiple,
  onSubmit,
}: QuestionnaireProps) {
  return (
    <div className="questionnaire">
      <h3>{title}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const selectedIds = formData
            .getAll("option")
            .filter((item): item is string => typeof item === "string");
          onSubmit(allowMultiple ? selectedIds : (selectedIds[0] ?? ""));
        }}
      >
        {options.map((option) => (
          <label key={option.id} className="questionnaire-option">
            <input
              type={allowMultiple ? "checkbox" : "radio"}
              name="option"
              value={option.id}
            />
            {option.label}
          </label>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
