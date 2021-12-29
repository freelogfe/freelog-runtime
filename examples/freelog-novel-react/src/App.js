import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
 

import "./App.scss";

  
import Home from "./pages/Home";
import { VConsole } from 'vconsole';

// or init with options
const vConsole = new VConsole({ maxLogNumber: 1000 });

// call `console` methods as usual
console.log('Hello world');
const Book = lazy(() => import("./pages/book/book"));
window.FREELOG_RESOURCENAME = '33323234234234sdf23'
const RouteExample = () => {
  return (
    <Router basename={window.__POWERED_BY_FREELOG__ ? "/" : "/"}>
      <Suspense fallback={null}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/book/:id" exact component={Book} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default function App() {
  return (
    <div className="app-main w-100x h-100x over-h">
      <RouteExample />
    </div>
  );
}
