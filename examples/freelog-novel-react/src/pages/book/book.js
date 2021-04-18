import React, { lazy, useState } from "react";
import { withRouter, Link } from "react-router-dom";
const Chapter = lazy(() => import("./component/chapter"));

function Book(props) {
  const bookId = props.match.params.id;
  const bookInfo = {
    name:
      "天空天空天空天空天空天空天空天空天空天空天空天空天空天空天空天空天空天空",
    id: 1,
    avatar:
      "http://www.beijing.gov.cn/photo/image_repository/wcm_image_1167437_additional_type_200.jpg",
    desc:
      "这是一个综合了无数电影电视的世界。巫师自法老的古墓中重生，恶魔男爵在联邦的抚养下成长，寂静岭的迷雾悄然扩张，大地之中沉睡的古老巨神即将苏醒，圣堂与地狱的战争更是一触即发。作为一个穿越者，罗宁发现自己老爹身上已经插满了旗子，他不仅和名叫康斯坦丁的男人谈笑风生，帮助温切斯特兄弟寻找失踪的父亲，还为恶灵骑士保存着一份魔鬼的契约……面对纷至沓来的邪恶与恐怖，无奈的罗宁只能将错就错，带着系统经营起了一家名叫DevilMayCry的猎魔事务所。",
    chapter: [
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
      { name: "第一章：爸爸去哪儿了", id: 2 },
    ],
  };
  const [current, setCurrent] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  function setChapterVisible(flag){
    setVisible(!!flag)
  }
   return (
    <div className="flex-column w-100x h-100x over-h">
      {visible?  <Chapter current={current} setVisible={setChapterVisible} /> : ''}
     
      <div className="bg-white bb-1 px-20 py-15 flex-row shrink-0">
        <div
          onClick={() => {
            props.history.push("/");
          }}
          onTouchStart={()=>{
            console.log(23232)
            setHovered(true)
          }}
          onTouchEnd={()=>{
            setHovered(false)
          }}
          className={"text-ellipsis flex-row align-center" + (hovered? ' fc-nav-active': '')}
        >
          <div className={"mr-5 fs-40 pb-5"  + (!hovered? ' fc-less': '')}>&lt;</div>{" "}
          <div className="fs-30 text-ellipsis flex-1">{bookInfo.name}</div>
        </div>
      </div>
      <div className="flex-1 over-h w-100x">
        <div className="flex-column h-100x y-auto w-100x">
          {/* 简介 */}
          <div className="flex-column bb-1">
            <div className="fw-bold fs-35 py-10 bg-less px-20">简介</div>
            <div className="fs-30 px-30 py-20">
              {!bookInfo.desc? <p>{bookInfo.desc}</p> : <span className="fc-less f-italic">暂无</span>}
            </div>
          </div>
          {/* 章节 */}
          <div className="flex-column">
            <div className="fw-bold fs-35 py-10 px-20 bg-less">
              章节（共{bookInfo.chapter.length}章）
            </div>
            {bookInfo.chapter.map((item, index) => {
              return (
                <div key={index} className="fs-30 pl-40 pr-10 py-20 bb-1" onClick={() => {
                  setCurrent({bookInfo, chapter: item, chapterIndex: index })
                  setVisible(true)
                }}>
                  {item.name}
                </div>
              );
            })}
          </div>
          <div className="fc-less w-100x mb-20 mt-10 text-center f-italic fs-30">到底啦....</div>
        </div>
      </div>
    </div>
  );
}
export default withRouter(Book);
