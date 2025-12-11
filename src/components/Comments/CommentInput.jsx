export function CommentInput({ onSubmit }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit(event);
    }
  };

  return (
    <div className="comments-input">
      <input
        type="text"
        id="comment-input-id"
        placeholder="COMMENT ON THIS PROJECT..."
        onKeyDown={handleKeyDown}
      ></input>
    </div>
  );
}
