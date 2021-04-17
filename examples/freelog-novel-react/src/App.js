import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Divider } from "antd";
import { Button } from "antd";

import "./App.scss";

import LibVersion from "./components/LibVersion";
import HelloModal from "./components/HelloModal";

import Home from "./pages/Home";
const Book = lazy(() => import("./pages/book/book"));
const Reader = lazy(() => import("./pages/book/reader"));
const Chapter = lazy(() => import("./pages/book/component/chapter"));

const RouteExample = () => {
  return (
    <Router basename={window.__POWERED_BY_FREELOG__ ? "/" : "/"}>
      <Suspense fallback={null}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/book/:id" exact component={Book} />
          <Route path="/book/:id/reader" exact component={Reader} />
          <Route path="/book/:id/reader/chapter" component={Chapter} />
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
