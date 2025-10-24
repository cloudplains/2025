import React from "react";
import "./popupMenu.css";
import PopupOption from "../popupOption";
import { PopupMenuProps, PopupMenuStates } from "./interface";
import { getIframeDoc } from "../../../utils/reader/docUtil";
import { ConfigService } from "../../../assets/lib/kookit-extra-browser.min";

class PopupMenu extends React.Component<PopupMenuProps, PopupMenuStates> {
  highlighter: any;
  timer!: NodeJS.Timeout;
  key: any;
  mode: string;
  showNote: boolean;
  isFirstShow: boolean;
  rect: any;
  constructor(props: PopupMenuProps) {
    super(props);
    this.showNote = false;
    this.isFirstShow = false;
    this.highlighter = null;
    this.mode = "";
    this.state = {
      deleteKey: "",
      rect: this.props.rect,
      isRightEdge: false,
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps: PopupMenuProps) {
    if (nextProps.rect !== this.props.rect) {
      this.setState(
        {
          rect: nextProps.rect,
        },
        () => {
          this.openMenu();
        }
      );
    }
  }

  handleShowDelete = (deleteKey: string) => {
    this.setState({ deleteKey });
  };
  showMenu = () => {
    let rect = this.state.rect;
    if (!rect) return;
    this.setState({ isRightEdge: false }, () => {
      let { posX, posY } = this.getHtmlPosition(rect);
      this.props.handleOpenMenu(true);
      let popupMenu = document.querySelector(".popup-menu-container");
      popupMenu?.setAttribute("style", `left:${posX}px;top:${posY}px`);
    });
  };
  getHtmlPosition(rect: any) {
    let pageSize = this.props.rendition.getPageSize();
    let posY = rect.bottom - pageSize.scrollTop;
    console.log(pageSize);
    let posX = rect.left + rect.width / 2;
    // fix popup position when crossing pages
    if (rect.width > pageSize.sectionWidth && rect.left < 0) {
      posX = rect.left + rect.width;
    }
    if (
      rect.top < 188 &&
      pageSize.height - rect.top - rect.height < 188 &&
      this.props.readerMode !== "scroll"
    ) {
      this.props.handleChangeDirection(true);
      posY = rect.top + 16 + pageSize.top;
    } else if (
      pageSize.height - rect.height < 188 &&
      pageSize.height - rect.height > -10
    ) {
      this.props.handleChangeDirection(true);
      posY = rect.top - pageSize.scrollTop + 16;
    } else if (
      rect.height - pageSize.height > 0 &&
      this.props.readerMode === "scroll"
    ) {
      posY = 40;
    } else if (posY < pageSize.height - 188 + pageSize.top) {
      this.props.handleChangeDirection(true);
      posY = posY + 16 + pageSize.top;
    } else {
      posY = posY - rect.height - 188 + pageSize.top;
    }
    posX = posX - 80 + pageSize.left;
    if (
      this.props.currentBook.format === "PDF" &&
      this.props.readerMode === "double" &&
      this.props.chapterDocIndex % 2 === 1 &&
      ConfigService.getReaderConfig("isConvertPDF") !== "yes"
    ) {
      posX = posX + pageSize.sectionWidth + pageSize.gap;
    }
    if (
      this.props.currentBook.format === "PDF" &&
      this.props.readerMode === "scroll" &&
      ConfigService.getReaderConfig("isConvertPDF") !== "yes" &&
      posY < 0
    ) {
      posY = posY + this.props.chapterDocIndex * pageSize.sectionHeight;
    }
    if (posY < 0) {
      posY = 16;
    }
    if (posY > pageSize.height - 188) {
      posY = pageSize.height - 188;
    }
    if (
      this.props.readerMode === "scroll" &&
      this.props.currentBook.format === "PDF"
    ) {
      posX = posX - pageSize.scrollLeft;
    }
    return { posX, posY } as any;
  }

  openMenu = () => {
    this.setState({ deleteKey: "" });
    let docs = getIframeDoc(this.props.currentBook.format);
    let sel: Selection | null = null;
    for (let i = 0; i < docs.length; i++) {
      let doc = docs[i];
      if (!doc) continue;
      sel = doc.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        break;
      }
    }
    this.props.handleChangeDirection(false);
    if (this.props.isOpenMenu) {
      this.props.handleMenuMode("");
      this.props.handleOpenMenu(false);
      this.props.handleNoteKey("");
    }
    if (!sel) return;
    if (sel.isCollapsed) {
      this.props.isOpenMenu && this.props.handleOpenMenu(false);
      this.props.handleMenuMode("menu");
      this.props.handleNoteKey("");
      return;
    }
    this.showMenu();
    this.props.handleMenuMode("menu");
  };

  render() {
    const PopupProps = {
      chapterDocIndex: this.props.chapterDocIndex,
      chapter: this.props.chapter,
    };
    return (
      <div>
        <div
          className="popup-menu-container"
          style={this.props.isOpenMenu ? {} : { display: "none" }}
        >
          <div className="popup-menu-box">
            {this.props.menuMode === "menu" ? (
              <PopupOption {...PopupProps} />
            ) : null}
          </div>
          {this.props.menuMode === "menu" &&
            (this.props.isChangeDirection ? (
              <span className="icon-popup popup-menu-triangle-up"></span>
            ) : (
              <span className="icon-popup popup-menu-triangle-down"></span>
            ))}
        </div>
      </div>
    );
  }
}

export default PopupMenu;
