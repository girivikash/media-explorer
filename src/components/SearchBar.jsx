export default function SearchBar({ label, value, onChange, onSubmit, placeholder, buttonText, disabled }) {
  return (
    <form
      className="search-form"
      onSubmit={event => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <label className="search-label">
        <span>{label}</span>
        <input
          type="text"
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={label}
          className="search-input"
          disabled={disabled}
        />
      </label>
      {onSubmit ? (
        <button type="submit" className="search-button" disabled={disabled}>
          {buttonText || 'Go'}
        </button>
      ) : null}
    </form>
  );
}
