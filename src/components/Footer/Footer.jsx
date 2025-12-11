export function Footer() {
  return (
    <>
      <div
        className="right-horizontal-row"
        style={{
          marginTop: "15px",
          marginBottom: "15px",
        }}
      ></div>
      <div className="right-footer">
        <div className="extra-btn-container">
          <div
            className="extra-btn"
            onClick={() =>
              window.open("https://github.com/malikgaurav626", "_blank")
            }
          >
            GITHUB
          </div>
          <div
            className="extra-btn"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/malikgaurav626/",
                "_blank"
              )
            }
          >
            LINKEDIN
          </div>
          <div
            className="extra-btn"
            onClick={() =>
              window.open("https://twitter.com/gauravm444", "_blank")
            }
          >
            TWITTER
          </div>
          <div
            className="extra-btn"
            onClick={() =>
              window.open("https://www.instagram.com/malik_aryan_58/", "_blank")
            }
          >
            INSTAGRAM
          </div>
        </div>
      </div>
    </>
  );
}
