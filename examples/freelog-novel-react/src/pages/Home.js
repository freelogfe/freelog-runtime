import React, {useEffect, useState} from "react";
import styles from "./home.module.scss";
export default function (props) {
  const [novels, setNovels] = useState([]);

  useEffect(async() => {
    const res = await window.freelogApp.getPresentables({ resourceType: 'novel'})
    setNovels(res.data.data.dataList)
  }, []);

  return (
    <div className={styles.homePage + " flex-column w-100x h-100x over-h"}>
      <div className={styles.header + " fs-40 mb-30 fw-bold p-20 bs-normal"}>
        全部小说
      </div>
      <div
        className="flex-row flex-wrap flex-1 w-100x y-auto space-between"
      >
        {novels.map((item, index) => {
          return (
            <div
              key={index}
              onClick={()=> {props.history.push("/book/" + item.presentableId)}}

              className={
                (index % 2 === 0 ? "ml-25" : " mr-25") +
                " mb-20 p-10 w-336 h-400 flex-column br-middle b-1 space-between"
              }
            >
              <div className="flex-1 over-h flex-column">
                <img className="h-100x" src={item.coverImages} />
              </div>
              <div className="mt-10 fw-bold fs-30 text-2-ellipsis text-break p-10">{item.presentableName} </div>
            </div>
          );
        })}
        <div className="fc-less w-100x mb-20 mt-10 text-center fs-30 f-italic self-start">到底啦....</div>
      </div>
    </div>
  );
}