import React from 'react';
import {withRouter,Link} from 'react-router-dom'
function reader() {
  return (
    <h2 className="app-nav-item" style={{ borderColor: 'green' }}>
                      <Link to={location => ({ ...location, pathname: location.pathname + '/chapter' })}>嵌套路由2</Link>

    </h2>
  );
}

export default withRouter(reader)