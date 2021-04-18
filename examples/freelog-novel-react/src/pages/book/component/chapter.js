import React, { useState } from "react";

export default function Chapter(props) {
  const [hovered, setHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);
  const [preHovered, setPreHovered] = useState(false);
  const chapters = props.current.bookInfo.chapter;
  const [chapterIndex, setChapterIndex] = useState(props.current.chapterIndex);
  const [chapter, setChapter] = useState(props.current.chapter);
  const [tapTime, setTaptime] = useState(0);
  let data =
    "            又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。         \r\n    又或者他们早就发现了那个小镇的异常，       \r\n 只不过对那尊邪神有什么特别的想法， \r\n 准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。 \r\n 又或者他们早就发现了那个小镇的异常，  \r\n 只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。";
  function getChapter(index) {
    if (chapters[index]) {
      let data2 = index%2 === 1 ? data :
        "          w43534535  又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。         \r\n    又或者他们早就发现了那个小镇的异常，       \r\n 只不过对那尊邪神有什么特别的想法， \r\n 准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。 \r\n 又或者他们早就发现了那个小镇的异常，  \r\n 只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。又或者他们早就发现了那个小镇的异常，只不过对那尊邪神有什么特别的想法，准备来个放长线钓大鱼，所以才一直没有行动。";
      setChapterIndex(index)
      setChapter({...chapters[index], data: data2});
    }
  }
  return (
    <div className="p-absolute w-100x h-100x over-h flex-column z-100  fadeInDown bg-less">
      <div className="flex-row w-100x over-h align-center py-10 pr-10 bb-1">
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
        <div className="flex-1 over-h">
          <div className="fs-30 text-ellipsis w-100x text-align-center">
            {chapter.name}
          </div>
        </div>
      </div>
      <div className="flex-1 w-100x over-h">
        <div className="w-100x h-100x y-auto fs-30 p-20 flex-column">
          <p className="lh-50 ls-4 text-pre-wrap pl-10">{chapter.data || data}</p>
          <div className="fc-less w-100x mb-20 mt-10 text-center f-italic">
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
