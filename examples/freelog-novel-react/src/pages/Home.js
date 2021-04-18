import React from "react";
import styles from "./home.module.scss";
export default function (props) {
  console.log(styles);

  const novels = [
    {
      name: "天空",
      id: 1,
      avatar:
        "http://www.beijing.gov.cn/photo/image_repository/wcm_image_1167437_additional_type_200.jpg",
    },
    {
      name: "云",
      id: 2,
      avatar:
        "https://album.u17i.com/image/2015/03/63/fb/1462869_101048_5836301_2BaN.jpg",
    },
    {
      name: "天空",
      id: 3,
      avatar:
        "http://www.beijing.gov.cn/photo/image_repository/wcm_image_1167437_additional_type_200.jpg",
    },
    {
      name: "云",
      id: 4,
      avatar:
        "https://album.u17i.com/image/2015/03/63/fb/1462869_101048_5836301_2BaN.jpg",
    },
    {
      name: "天空",
      id: 5,
      avatar:
        "http://www.beijing.gov.cn/photo/image_repository/wcm_image_1167437_additional_type_200.jpg",
    },
    {
      name: "云",
      id: 6,
      avatar:
        "https://album.u17i.com/image/2015/03/63/fb/1462869_101048_5836301_2BaN.jpg",
    },
  ];
  return (
    <div className={styles.homePage + " flex-column w-100x h-100x over-h"}>
      <div className={styles.header + " fs-40 mb-10 fw-bold p-20 bs-normal"}>
        全部小说
      </div>
      <div
        className="flex-row flex-wrap flex-1 w-100x y-auto space-between"
      >
        {novels.map((item, index) => {
          return (
            <div
              key={index}
              onClick={()=> {props.history.push("/book/" + item.id)}}

              className={
                (index % 2 === 0 ? "ml-25" : " mr-25") +
                " mb-20 p-10 w-336 h-400 flex-column br-middle b-1 space-between"
              }
            >
              <div className="flex-1 over-h flex-column">
                <img className="h-100x" src={item.avatar} />
              </div>
              <div className="mt-10 fw-bold fs-30 text-2-ellipsis text-break">{item.name}you are Unnecessary Unnecessary Unnecessary </div>
            </div>
          );
        })}
        <div className="fc-less w-100x mb-20 mt-10 text-center fs-30 f-italic">到底啦....</div>
      </div>
    </div>
  );
}
