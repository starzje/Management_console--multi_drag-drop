import * as React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./redux/store";
import { Provider } from "react-redux";

import App from "./App";
import "./styles/style.scss";

const mountNode = document.getElementById("app");
const root = ReactDOM.createRoot(mountNode);

root.render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>,
);
