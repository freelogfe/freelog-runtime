import React from 'react';
import {withRouter,Link} from 'react-router-dom'

 function book(props) {
  return (
    <div>
          <h2 className="app-nav-item" style={{ borderColor: 'green' }}>
      book
    </h2>
      <Link to="/book/reader">嵌套路由1</Link>
                <Link to="/book/reader/chapter">嵌套路由2</Link>
                {props.children}
    </div>

  );
}
export default withRouter(book)