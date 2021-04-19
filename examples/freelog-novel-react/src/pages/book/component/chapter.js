import React, { useState, useEffect, useRef } from "react";

export default function Chapter(props) {
  const [hovered, setHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);
  const [preHovered, setPreHovered] = useState(false);
  const chapters = props.current.chapters;
  const [chapterIndex, setChapterIndex] = useState(props.current.chapterIndex);
  const [chapter, setChapter] = useState(chapters[chapterIndex]);
  const [tapTime, setTaptime] = useState(0);
  const scrollRef = useRef(null);

  async function getChapter(index) {
    if (chapters[index]) {
      const res = await window.freelogApp.getFileStreamById(chapters[index].presentableId)
      setChapterIndex(index)
      setChapter({...chapters[index], data: res.data});
      scrollRef.current.scrollTop = 0
    }
  }

  useEffect(async() => {
    getChapter(chapterIndex)
   }, []);
  return (
    <div className="p-absolute w-100x h-100x over-h flex-column z-100  fadeInDown bg-less">
      <div className="flex-row w-100x over-h align-center py-10 pr-10 bb-1 b-box">
        <div
          className={
            (hovered ? " fc-nav-active" : "fc-less") +
            " fs-40 mb-10 px-20 pl-10 "
          }
          onClick={() => {
            props.setVisible(false);
          }}
          onTouchStart={() => {
            setHovered(true);
          }}
          onTouchEnd={() => {
            setHovered(false);
          }}
        >
          x
        </div>
        <div className="flex-1 over-h h-55">
          <div className="fs-30 text-ellipsis w-100x b-box text-align-center pr-40 lh-55">
            {chapter.presentableName}
          </div>
        </div>
      </div>
      <div className="flex-1 w-100x over-h">
        <div className="w-100x h-100x y-auto fs-35 px-20 pt-30 flex-column b-box" ref={scrollRef}>
          <p className="lh-50 ls-4 text-pre-wrap px-10 flex-1">{chapter.data || ''}</p>
          <div className="fc-less w-100x  py-30 text-center f-italic">
            本章结束....
          </div>
        </div>
      </div>
      <div className="flex-row fs-30 bt-1 align-center">
        <div
          className={
            (preHovered ? " fc-nav-active" : "") +
            " w-260 text-align-center py-20 bg-white " +
            (chapterIndex === 0 ? "fc-less disabled" : "")
          }
          onTouchStart={() => {
            setTaptime(new Date().getTime())
            console.log(23232);
            setPreHovered(true);
          }}
          onTouchEnd={() => {
            if(new Date().getTime() - tapTime > 50 && new Date().getTime() - tapTime < 500){
              getChapter(chapterIndex - 1);
            }
            setPreHovered(false);
          }} 
        >
          上一章
        </div>
        <div className="flex-1 bg-less text-align-center">
          {chapterIndex + 1}/{chapters.length}
        </div>
        <div
          className={
            (nextHovered ? " fc-nav-active" : "") +
            " w-260 text-align-center py-20 bg-white " +
            (chapterIndex === chapters.length - 1 ? "fc-less disabled" : "")
          }
          onTouchStart={() => {
            setTaptime(new Date().getTime())
            setNextHovered(true);
          }}
          onTouchEnd={() => {
            if(new Date().getTime() - tapTime > 50 && new Date().getTime() - tapTime < 500){
              getChapter(chapterIndex + 1);
            }
            setNextHovered(false);
          }} 
        >
          下一章
        </div>
      </div>
    </div>
  );
}
