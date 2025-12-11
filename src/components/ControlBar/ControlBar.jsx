import React from "react";
import {
  PlaySVG,
  PauseSVG,
  BackSVG,
  NextSVG,
  InfoSVG,
  ShareSVG,
  ShareSVGPink,
  MuteSVG,
  UnmuteSVG,
  MenuSVG,
  MenuSVGPink,
  CloseCommentsSVG,
} from "../Social/ControlIcons";
import {
  TwitterSVG,
  InstagramSVG,
  LinkedInSVG,
  FacebookSVG,
  LinkSVG,
} from "../Social/SocialIcons";
import {
  TwitterShareBody,
  InstagramShareBody,
  LinkedInShareBody,
  FacebookShareBody,
  LinkShareBody,
} from "../Social/ShareComponents";
import "./ControlBar.css";

export function ControlBar({
  isPlaying,
  setisPlaying,
  onShare,
  onInfo,
  onBack,
  onNext,
  onMute,
  isMuted,
  currentMode,
  variant = "medium",
  // Medium body specific props
  projects = null,
  currentProject = null,
  commentOpen = false,
  setCommentOpen = null,
  menuOpen = false,
  setMenuOpen = null,
  shareOpen = false,
  setShareOpen = null,
  dropdownOpen = false,
  setDropdownOpen = null,
  currentChannel = 0,
  setCurrentChannel = null,
  currentShareSocial = 0,
  setCurrentShareSocial = null,
  channels = [],
  view3d = false,
  setView3d = null,
  handleDialClick = null,
  handleCommentSubmit = null,
}) {
  // Local state for large variant dropdown
  const [largeDropdownOpen, setLargeDropdownOpen] = React.useState(false);
  // SVG Components for medium body
  function SVG1() {
    return (
      <svg
        width="30"
        height="18"
        viewBox="0 0 30 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.627 14.341 13.33 14H7.5a6.5 6.5 0 1 1 0-13h15a6.5 6.5 0 1 1 0 13h-4.829l-.299.341-1.872 2.14-1.873-2.14ZM15.5 18l.664-.76L18.125 15H22.5a7.5 7.5 0 0 0 0-15h-15a7.5 7.5 0 1 0 0 15h5.375l1.96 2.24.665.76Zm-5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14 7.5a1.5 1.5 0 1 0 3 0h-3ZM20.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
          fill="#F2D4F2"
        ></path>
      </svg>
    );
  }

  function SVG2() {
    return (
      <svg
        width="30"
        height="18"
        viewBox="0 0 30 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.627 14.341 13.33 14H7.5a6.5 6.5 0 1 1 0-13h15a6.5 6.5 0 1 1 0 13h-4.829l-.299.341-1.872 2.14-1.873-2.14ZM15.5 18l.664-.76L18.125 15H22.5a7.5 7.5 0 0 0 0-15h-15a7.5 7.5 0 1 0 0 15h5.375l1.96 2.24.665.76Zm-5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14 7.5a1.5 1.5 0 1 0 3 0h-3ZM20.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
          fill="#0E3DFF"
        ></path>
      </svg>
    );
  }

  function View3dEnv() {
    return (
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="15.000000pt"
        height="15.000000pt"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill="#0030ff"
          stroke="none"
        >
          <path
            d="M2370 4184 c-589 -70 -1135 -342 -1715 -855 -203 -179 -537 -540
 -623 -674 -36 -56 -36 -134 0 -190 46 -72 240 -297 378 -438 493 -508 1042
 -864 1560 -1012 225 -64 339 -79 590 -79 251 0 365 15 590 79 607 174 1274
 647 1806 1283 146 174 158 195 158 262 0 67 -12 88 -158 262 -529 631 -1194
 1105 -1796 1280 -202 59 -336 78 -555 82 -110 3 -216 2 -235 0z m435 -349
 c471 -71 984 -348 1477 -799 151 -137 448 -454 448 -477 0 -3 -34 -46 -77 -94
 -582 -666 -1244 -1089 -1848 -1180 -128 -19 -362 -19 -490 0 -435 66 -899 303
 -1360 694 -167 141 -565 551 -565 581 0 4 34 47 77 95 578 661 1240 1086 1839
 1179 122 19 375 19 499 1z"
          />
          <path
            d="M2420 3564 c-433 -79 -741 -361 -846 -774 -27 -106 -27 -354 0 -460
 97 -380 376 -659 756 -756 106 -27 354 -27 460 0 380 97 659 376 756 756 15
 58 19 110 19 230 0 120 -4 172 -19 230 -95 375 -366 650 -741 752 -68 19 -323
 33 -385 22z m300 -350 c187 -42 358 -179 445 -359 52 -107 68 -189 63 -325 -5
 -129 -30 -216 -90 -318 -42 -72 -158 -188 -230 -230 -211 -124 -485 -124 -696
 0 -72 42 -188 158 -230 230 -124 211 -124 485 0 696 42 72 158 188 230 230
 151 89 328 116 508 76z"
          />
        </g>
      </svg>
    );
  }

  function Hide3dEnv() {
    return (
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="15.000000pt"
        height="15.000000pt"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill="#0030ff"
          stroke="none"
        >
          <path
            d="M4260 4470 c-14 -6 -147 -133 -297 -282 l-271 -271 -129 50 c-208 83
 -406 135 -638 170 -184 27 -571 24 -764 -6 -509 -78 -959 -281 -1385 -624
 -135 -108 -391 -366 -500 -502 -118 -149 -264 -368 -272 -410 -11 -60 4 -100
 86 -223 240 -363 584 -709 930 -937 58 -38 107 -70 109 -72 3 -2 -104 -113
 -236 -246 -207 -207 -242 -247 -248 -280 -11 -60 3 -107 44 -148 41 -41 88
 -55 148 -44 34 6 227 196 1831 1798 1317 1317 1795 1801 1803 1826 22 67 -2
 139 -63 184 -31 23 -111 32 -148 17z m-1360 -655 c172 -26 363 -76 514 -135
 l30 -11 -164 -164 -164 -164 -27 19 c-52 38 -215 110 -294 132 -106 28 -344
 31 -449 5 -183 -46 -328 -128 -462 -261 -133 -134 -215 -280 -261 -462 -27
 -108 -24 -334 5 -444 23 -83 89 -234 131 -295 l20 -31 -203 -203 -203 -203
 -95 59 c-332 209 -669 527 -878 829 l-51 74 50 73 c177 256 485 564 746 748
 352 248 768 405 1181 448 124 13 448 5 574 -14z m-198 -634 c62 -16 178 -64
 178 -74 0 -1 -195 -197 -434 -436 l-434 -434 -27 52 c-36 73 -65 191 -65 270
 1 409 394 721 782 622z"
          />
          <path
            d="M4137 3462 c-59 -59 -107 -112 -106 -117 0 -6 39 -40 87 -77 205
 -157 475 -445 621 -660 l32 -48 -41 -60 c-172 -254 -471 -557 -735 -746 -452
 -324 -980 -489 -1505 -470 -164 5 -215 11 -383 42 l-89 17 -129 -129 c-93 -93
 -125 -130 -115 -136 28 -16 265 -69 401 -90 187 -29 568 -31 750 -5 645 95
 1183 373 1675 866 176 177 291 316 420 509 129 192 129 209 12 388 -112 170
 -265 357 -427 520 -137 138 -328 304 -349 304 -6 0 -60 -48 -119 -108z"
          />
          <path
            d="M3336 2661 l-138 -138 -13 -79 c-16 -92 -73 -214 -134 -287 -94 -113
 -238 -198 -375 -222 l-79 -13 -141 -141 c-77 -77 -137 -143 -134 -146 12 -12
 165 -34 239 -35 253 -1 486 98 674 285 193 193 278 396 279 665 1 125 -16 250
 -32 250 -4 0 -69 -62 -146 -139z"
          />
        </g>
      </svg>
    );
  }

  function SelectChannelArrow() {
    return (
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="15.000000pt"
        height="15.000000pt"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill="#0030ff"
          stroke="none"
        >
          <path
            d="M2480 4464 c-44 -19 -933 -904 -961 -956 -26 -50 -25 -136 1 -187 53
 -105 179 -146 285 -94 17 8 193 178 393 376 l362 362 363 -362 c199 -198 376
 -368 392 -376 107 -53 238 -8 286 97 25 54 24 136 0 184 -29 55 -917 938 -963
 957 -47 19 -112 19 -158 -1z"
          />
          <path
            d="M1615 1901 c-72 -32 -125 -113 -125 -191 0 -83 0 -83 483 -568 254
 -255 474 -470 489 -478 41 -21 108 -28 158 -14 41 10 89 55 503 468 252 251
 467 474 478 494 12 23 19 57 19 90 -1 162 -161 262 -305 191 -16 -8 -193 -178
 -392 -376 l-363 -362 -367 367 c-248 248 -380 372 -405 383 -50 20 -124 19
 -173 -4z"
          />
        </g>
      </svg>
    );
  }

  return (
    <div className={`channel-table channel-table-${variant}`}>
      <table className={`control-table control-table-${variant}`}>
        <tbody>
          {variant === "large" && (
            <>
              <tr className={`control-tr control-tr-${variant}`}>
                <td
                  className={`control-td control-td-${variant}`}
                  colSpan="6"
                  style={{
                    padding: "0px",
                    margin: "0px",
                  }}
                >
                  <div
                    className="medium-row-top-middle-container control-td-large"
                    onClick={() => setLargeDropdownOpen(!largeDropdownOpen)}
                  >
                    <div
                      className="view-3d-btn-container"
                      onClick={(event) => {
                        event.stopPropagation();
                        setView3d && setView3d(!view3d);
                      }}
                    >
                      {view3d ? <View3dEnv /> : <Hide3dEnv />}
                    </div>
                    <div
                      className={`dropdown-menu ${
                        largeDropdownOpen ? "dropdown-active" : ""
                      }`}
                    >
                      {channels.map((channel, index) => (
                        <div
                          key={index}
                          className="dropdown-item"
                          onClick={() => {
                            setLargeDropdownOpen(false);
                            setCurrentChannel && setCurrentChannel(index);
                          }}
                        >
                          {channel}
                        </div>
                      ))}
                    </div>
                    <div className="current-channel">
                      {channels[currentChannel]}
                    </div>
                    <div className="select-channel-arrows">
                      <SelectChannelArrow />
                    </div>
                  </div>
                </td>
              </tr>
              <tr className={`control-tr control-tr-${variant}`}>
                <td
                  className={`control-td control-td-${variant}`}
                  onClick={onShare}
                >
                  <ShareSVG currentMode={currentMode} />
                </td>
                <td
                  className={`control-td control-td-${variant}`}
                  onClick={onInfo}
                >
                  <InfoSVG />
                </td>
                <td
                  className={`control-td control-td-${variant}`}
                  onClick={onBack}
                >
                  <BackSVG />
                </td>
                <td
                  className={`control-td control-td-${variant}`}
                  onClick={onNext}
                >
                  <NextSVG />
                </td>
                <td
                  className={`control-td control-td-${variant}`}
                  onClick={() => setisPlaying(!isPlaying)}
                >
                  {isPlaying ? <PauseSVG /> : <PlaySVG />}
                </td>
                <td
                  className={`control-td control-td-${variant}`}
                  onClick={onMute}
                >
                  {isMuted ? <UnmuteSVG /> : <MuteSVG />}
                </td>
              </tr>
            </>
          )}

          {variant === "medium" && projects && currentProject !== null && (
            <>
              <tr className="medium-tr">
                <td
                  className="medium-td"
                  onClick={() => setCommentOpen && setCommentOpen(!commentOpen)}
                >
                  {currentMode == 1 ? <SVG1 /> : <SVG2 />}
                  <div
                    className={
                      "medium-comments-container " +
                      (commentOpen ? "medium-comments-active" : " ")
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <div className="medium-comments-heading">
                      <div className="medium-comments-logo">
                        <SVG1 />
                      </div>
                      <div className="medium-comments-title">COMMENTS</div>
                      <div
                        className="medium-comments-close-btn"
                        onClick={() => setCommentOpen && setCommentOpen(false)}
                      >
                        <CloseCommentsSVG />
                      </div>
                    </div>
                    <div className="medium-comments-body">
                      <div className="medium-comments-content">
                        {projects[currentProject]?.comments?.map(
                          (comment, index) => {
                            const commentDate = new Date(comment.date);
                            const currentDate = new Date();
                            const differenceInTime =
                              currentDate.getTime() - commentDate.getTime();
                            const differenceInDays = Math.floor(
                              differenceInTime / (1000 * 3600 * 24)
                            );

                            return (
                              <div
                                key={"cmt-" + currentProject + "-" + index}
                                className="comment"
                              >
                                <div className="comment-body">
                                  <div className="comment-text">
                                    <div className="comment-user">
                                      @{comment.user}_
                                    </div>
                                    <div className="comment-body-text">
                                      {comment.text}
                                    </div>
                                  </div>
                                </div>
                                <div className="comment-time">
                                  {differenceInDays} days ago
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="comments-input medium-comments-input">
                        <input
                          type="text"
                          id="comment-input-id"
                          placeholder="COMMENT ON THIS PROJECT..."
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && handleCommentSubmit)
                              handleCommentSubmit(event);
                          }}
                        ></input>
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  className="medium-td"
                  colSpan="4"
                  style={{
                    padding: "0px",
                    margin: "0px",
                  }}
                >
                  <div
                    className="medium-row-top-middle-container"
                    onClick={() =>
                      setDropdownOpen && setDropdownOpen(!dropdownOpen)
                    }
                  >
                    <div
                      className="view-3d-btn-container"
                      onClick={(event) => {
                        event.stopPropagation();
                        setView3d && setView3d(!view3d);
                      }}
                    >
                      {view3d ? <View3dEnv /> : <Hide3dEnv />}
                    </div>
                    <div
                      className={`dropdown-menu ${
                        dropdownOpen ? "dropdown-active" : ""
                      }`}
                    >
                      {channels.map((channel, index) => (
                        <div
                          key={index}
                          className="dropdown-item"
                          onClick={() => {
                            setDropdownOpen && setDropdownOpen(false);
                            setCurrentChannel && setCurrentChannel(index);
                          }}
                        >
                          {channel}
                        </div>
                      ))}
                    </div>
                    <div className="current-channel">
                      {channels[currentChannel]}
                    </div>
                    <div className="select-channel-arrows">
                      <SelectChannelArrow />
                    </div>
                  </div>
                </td>
                <td
                  className="medium-td medium-menu-container-container"
                  style={{
                    position: "relative",
                  }}
                  onClick={() => setMenuOpen && setMenuOpen(!menuOpen)}
                >
                  <MenuSVG />
                  <div
                    className={
                      "medium-menu-container " +
                      (menuOpen ? "medium-menu-active" : " ")
                    }
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="medium-menu-heading">
                      <div className="medium-menu-logo">
                        <MenuSVGPink />
                      </div>
                      <div className="medium-menu-title">MENU</div>
                      <div
                        className="medium-menu-close-btn"
                        onClick={() => setMenuOpen && setMenuOpen(false)}
                      >
                        <CloseCommentsSVG />
                      </div>
                    </div>
                    <div className="medium-menu-body">
                      <div className="medium-circular-dial-container">
                        <div className="signal">SIGNAL</div>
                        <div className="dial" onClick={handleDialClick}>
                          <div className="medium-dialer"></div>
                        </div>
                        <div className="frequency">10 KHZ</div>
                      </div>
                      <div className="right-horizontal-row"></div>
                      <div className="medium-brightness-mode">
                        <div className="medium-brightness-title">DARK MODE</div>
                        <div className="medium-mode-toggle-container">
                          <div
                            className={
                              "medium-toggle-btn " +
                              (currentMode == 1 && "medium-active-btn")
                            }
                            onClick={() => {}}
                          ></div>
                          <div
                            className={
                              "medium-toggle-btn " +
                              (currentMode == 0 && "medium-active-btn")
                            }
                            onClick={() => {}}
                          ></div>
                        </div>
                        <div className="btn-container">
                          <div
                            className={
                              "medium-psuedo-btn " +
                              (currentMode == 1 && "medium-active-psuedo-btn")
                            }
                            onClick={() => {}}
                          >
                            ON
                          </div>
                          <div
                            className={
                              "medium-psuedo-btn " +
                              (currentMode == 0 && "medium-active-psuedo-btn")
                            }
                            onClick={() => {}}
                          >
                            OFF
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="medium-tr">
                <td
                  className="medium-td"
                  onClick={() => setShareOpen && setShareOpen(!shareOpen)}
                >
                  <ShareSVG />
                  <div
                    className={
                      "medium-share-container " +
                      (shareOpen ? "medium-share-active" : " ")
                    }
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="medium-share-heading">
                      <div className="medium-share-logo">
                        <ShareSVGPink />
                      </div>
                      <div className="medium-share-title">
                        SHARE THIS PROJECT
                      </div>
                      <div
                        className="medium-share-close-btn"
                        onClick={() => setShareOpen && setShareOpen(!shareOpen)}
                      >
                        <CloseCommentsSVG />
                      </div>
                    </div>
                    <div className="medium-share-body">
                      <div className="social-icons-container">
                        <div
                          className={
                            "social-icon " +
                            (currentShareSocial == 0
                              ? "social-icon-active"
                              : "")
                          }
                          onClick={() =>
                            setCurrentShareSocial && setCurrentShareSocial(0)
                          }
                        >
                          <TwitterSVG />
                        </div>
                        <div
                          className={
                            "social-icon " +
                            (currentShareSocial == 1
                              ? "social-icon-active"
                              : "")
                          }
                          onClick={() =>
                            setCurrentShareSocial && setCurrentShareSocial(1)
                          }
                        >
                          <InstagramSVG />
                        </div>
                        <div
                          className={
                            "social-icon " +
                            (currentShareSocial == 2
                              ? "social-icon-active"
                              : "")
                          }
                          onClick={() =>
                            setCurrentShareSocial && setCurrentShareSocial(2)
                          }
                        >
                          <LinkedInSVG />
                        </div>
                        <div
                          className={
                            "social-icon " +
                            (currentShareSocial == 3
                              ? "social-icon-active"
                              : "")
                          }
                          onClick={() =>
                            setCurrentShareSocial && setCurrentShareSocial(3)
                          }
                        >
                          <FacebookSVG />
                        </div>
                        <div
                          className={
                            "social-icon " +
                            (currentShareSocial == 4
                              ? "social-icon-active"
                              : "")
                          }
                          onClick={() =>
                            setCurrentShareSocial && setCurrentShareSocial(4)
                          }
                        >
                          <LinkSVG />
                        </div>
                      </div>
                      <div className="current-social-container">
                        {currentShareSocial == 0 ? (
                          <TwitterShareBody />
                        ) : currentShareSocial == 1 ? (
                          <InstagramShareBody />
                        ) : currentShareSocial == 2 ? (
                          <LinkedInShareBody />
                        ) : currentShareSocial == 3 ? (
                          <FacebookShareBody />
                        ) : (
                          <LinkShareBody />
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="medium-td">
                  <InfoSVG />
                </td>
                <td className="medium-td">
                  <BackSVG />
                </td>
                <td className="medium-td">
                  <NextSVG />
                </td>
                <td
                  className="medium-td"
                  onClick={() => {
                    setisPlaying(!isPlaying);
                  }}
                >
                  {isPlaying ? <PauseSVG /> : <PlaySVG />}
                </td>
                <td className="medium-td" onClick={() => {}}>
                  {isMuted ? <UnmuteSVG /> : <MuteSVG />}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
