import { useState } from "react";
import { TwitterSVG } from "./SocialIcons";

export function TwitterShareBody() {
  const tweetText = "This is the pre-specified text for the tweet.";
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;

  return (
    <>
      <div className="current-social-logo">
        <TwitterSVG />
      </div>
      <div className="medium-tweet">
        <input
          type="text"
          value={tweetText}
          readOnly
          style={{ cursor: "default" }}
          className="medium-tweet-input"
        />
        <button
          className="medium-tweet-btn"
          onClick={() => window.open(tweetUrl, "_blank")}
        >
          Tweet
        </button>
      </div>
    </>
  );
}

export function InstagramShareBody() {
  const [instagramText, setInstagramText] = useState(
    "This is the pre-specified text for the Instagram story."
  );
  const [buttonText, setButtonText] = useState("Copy to Clipboard");
  const instagramAppUrl = "instagram://app";
  const instagramWebUrl = "https://www.instagram.com/";

  const openInstagram = () => {
    window.open(instagramAppUrl, "_blank");
    setTimeout(() => {
      if (!document.hasFocus()) {
        window.location = instagramWebUrl;
      }
    }, 500);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(instagramText)
        .then(() => {
          setButtonText("Copied to Clipboard");
        })
        .catch((err) => console.error("Could not copy text: ", err));
    } else {
      const textarea = document.createElement("textarea");
      textarea.textContent = instagramText;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setButtonText("Copied");
      } catch (err) {
        console.error("Could not copy text: ", err);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <>
      <div className="current-social-logo">
        <InstagramSVG />
      </div>
      <div
        className="medium-tweet medium-insta"
        style={{ margin: "10px 20px" }}
      >
        <input
          type="text"
          value={instagramText}
          readOnly
          style={{ cursor: "default" }}
          className="medium-tweet-input"
        />
        <button
          className="medium-tweet-btn"
          style={{ transform: "scale(0.7)" }}
          onClick={copyToClipboard}
        >
          {buttonText}
        </button>
      </div>
      <button className="medium-tweet-btn" onClick={openInstagram}>
        Open Instagram
      </button>
    </>
  );
}

export function LinkedInShareBody() {
  const linkedinText = encodeURIComponent(
    "This is the pre-specified text for the LinkedIn post."
  );

  const openLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${linkedinText}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="current-social-logo">
        <LinkedInSVG />
      </div>
      <div className="medium-tweet" style={{ margin: "10px 20px" }}>
        <input
          type="text"
          value={"This is the pre-specified text for the LinkedIn post."}
          readOnly
          style={{ cursor: "default" }}
          className="medium-tweet-input"
        />
        <button
          className="medium-tweet-btn"
          onClick={openLinkedIn}
          style={{ transform: "scale(0.7)" }}
        >
          Open LinkedIn
        </button>
      </div>
    </>
  );
}

export function FacebookShareBody() {
  const facebookText = encodeURIComponent(
    "This is the pre-specified text for the Facebook post."
  );

  const openFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${facebookText}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="current-social-logo">
        <FacebookSVG />
      </div>
      <div className="medium-tweet" style={{ margin: "10px 20px" }}>
        <input
          type="text"
          value={"This is the pre-specified text for the Facebook post."}
          readOnly
          style={{ cursor: "default" }}
          className="medium-tweet-input"
        />
        <button
          className="medium-tweet-btn"
          onClick={openFacebook}
          style={{ transform: "scale(0.7)" }}
        >
          Open Facebook
        </button>
      </div>
    </>
  );
}

export function LinkShareBody() {
  const link = "https://malikgaurav626.netlify.app";
  const [buttonText, setButtonText] = useState("Copy");

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          setButtonText("Link Copied");
        })
        .catch((err) => console.error("Could not copy link: ", err));
    } else {
      const textarea = document.createElement("textarea");
      textarea.textContent = link;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setButtonText("Link Copied");
      } catch (err) {
        console.error("Could not copy link: ", err);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <>
      <div className="current-social-logo">
        <LinkSVG />
      </div>
      <div className="medium-tweet" style={{ margin: "10px 20px" }}>
        <input
          type="text"
          value={link}
          readOnly
          style={{ cursor: "default" }}
          className="medium-tweet-input"
        />
        <button
          className="medium-tweet-btn"
          style={{ transform: "scale(0.7)" }}
          onClick={copyToClipboard}
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

// Import missing SVG components
import { InstagramSVG, LinkedInSVG, FacebookSVG, LinkSVG } from "./SocialIcons";
