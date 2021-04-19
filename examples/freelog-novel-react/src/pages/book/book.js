import React, { lazy, useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import {toChinesNum} from '../../utils/utils'

const Chapter = lazy(() => import("./component/chapter"));
function Book(props) {
  const bookId = props.match.params.id;
  const [bookInfo, setBookInfo] = useState({});
  const [chapters, setChapters] = useState([]);

  useEffect(async() => {
    const res = await window.freelogApp.getPresentablesSearch({presentableIds: bookId})
    const bookResource = await window.freelogApp.getResourceInfoById(bookId)
    console.log(bookResource)
    setBookInfo({...res.data.data[0], intro: bookResource.data.data.intro})
    const chaptersRes = await window.freelogApp.getPresentables({ resourceType: "chapter", tags: res.data.data[0].presentableName, isLoadVersionProperty: 1})
    let chaptersData = chaptersRes.data.data.dataList
    console.log(chaptersData)
    chaptersData.sort((a,b)=>{
      let aIndex = 0
      let bIndex = 1
      try{
         aIndex = parseInt(a.versionProperty.chapter)
         bIndex = parseInt(b.versionProperty.chapter)
      }catch(e){
        console.log("chapter 设置错误 " + a.presentableName + ' 或者 ' + b.presentableName )
      }
      return aIndex - bIndex
    })
    chaptersData = chaptersData.map((item, index)=>{
      item.chapterIndex = '第' + toChinesNum(index + 1) + '章'  
      return item
    })
    setChapters(chaptersRes.data.data.dataList || [])
  }, []);
  
  
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
          <div className="fs-30 text-ellipsis flex-1 lh-55">{bookInfo.presentableName}</div>
        </div>
      </div>
      <div className="flex-1 over-h w-100x">
        <div className="flex-column h-100x y-auto w-100x">
          {/* 简介 */}
          <div className="flex-column bb-1">
            <div className="fw-bold fs-35 py-20 bg-less px-20">简介</div>
            <div className="fs-30 px-30 py-20 mb-20 lh-50">
              {bookInfo.intro? <p className="">{bookInfo.intro}</p> : <span className="fc-less f-italic">暂无</span>}
            </div>
          </div>
          {/* 章节 */}
          <div className="flex-column">
            <div className="fw-bold fs-35 py-20 px-20 bg-less">
              章节（共{chapters.length}章）
            </div>
            {chapters.map((item, index) => {
              return (
                <div key={index} className="fs-30 pl-40 pr-10 py-30 bb-1 text-pre-wrap" onClick={() => {
                  setCurrent({bookInfo, chapters, chapterIndex: index })
                  setVisible(true)
                }}>
                  {item.chapterIndex + '      '  + item.presentableName}
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
