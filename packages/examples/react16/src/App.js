import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Divider } from 'antd';
import { Button } from 'antd';

import 'antd/dist/antd.min.css';
import './App.css';

import LibVersion from './components/LibVersion';
import HelloModal from './components/HelloModal';

import Home from './pages/Home';
const Book = lazy(() => import('./pages/book'));
const Reader = lazy(() => import('./pages/book/reader'));
const Chapter = lazy(() => import('./pages/book/component/chapter'));

const RouteExample = () => {
  return (
    <Router basename={window.__POWERED_BY_FREELOG__ ? '/' : '/'}>
      <nav>
        <Link to="/">Home</Link>
        <Divider type="vertical" />
        <Link to="/book">bo ok</Link>
      </nav>
      <Button type="primary">Button</Button>
      <Suspense fallback={null}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/book" component={Book} component={()=>(
                <Book>
                   <Route  exact path="/book/reader" component={Reader} />
                    <Route path="/book/reader/chapter" component={Chapter} />
                </Book>
            )}/>
        </Switch>
      </Suspense>
    </Router>
  );
};

export default function App() {
  return (
    <div className="app-main">
      <LibVersion />
      <HelloModal />

      <Divider />

      <RouteExample />
    </div>
  );
}
