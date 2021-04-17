import React from "react";
import { withRouter, Link } from "react-router-dom";

function book(props) {
  console.log(props);
  const bookId = props.match.params.id;
  console.log(bookId);
  const bookInfo = {
    name: "天空天空天空天空天空天空天空天空天空天空天空天空天空天空天空天空天空天空",
    id: 1,
    avatar:
      "http://www.beijing.gov.cn/photo/image_repository/wcm_image_1167437_additional_type_200.jpg",
  };
  const chapters = [{ name: "天空1" }, { name: "天空2" }];
  return (
    <div className="flex-column w-100x h-100x over-h">
      <div className="bg-white bb-1 px-20 py-15 flex-row">
        <div
          onClick={()=> {props.history.push("/")}}
          className="text-ellipsis flex-row align-center"
        >
          <div className="mr-5 fs-40 pb-5">&lt;</div> <div className="fs-30 text-ellipsis flex-1">{bookInfo.name}</div>
        </div>
      </div>
      {/* 简介 */}
      <div>

      </div>
      {/* 章节 */}
      <div>
        
      </div>
    </div>
  );
}
export default withRouter(book);
