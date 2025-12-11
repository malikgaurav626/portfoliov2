export function CommentList({ comments, currentProject }) {
  return (
    <div className="comments-content">
      {comments?.map((comment, index) => {
        const commentDate = new Date(comment.date);
        const currentDate = new Date();
        const differenceInTime = currentDate.getTime() - commentDate.getTime();
        const differenceInDays = Math.floor(
          differenceInTime / (1000 * 3600 * 24)
        );

        return (
          <div key={"cmt-" + currentProject + "-" + index} className="comment">
            <div className="comment-body">
              <div className="comment-text">
                <div className="comment-user">@{comment.user}_</div>
                <div className="comment-body-text">{comment.text}</div>
              </div>
            </div>
            <div className="comment-time">{differenceInDays} days ago</div>
          </div>
        );
      })}
    </div>
  );
}
