// reduxTestWrapper.ts
import * as React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { rootReducer } from "../../../../redux/store";

interface WrapperProps {
  children: React.ReactNode;
  store: EnhancedStore;
}

function Wrapper({ children, store }: WrapperProps) {
  return <Provider store={store}>{children}</Provider>;
}

function renderWithReduxStore(ui: React.ReactNode, initialState?: any) {
  const store = configureStore({ reducer: rootReducer, preloadedState: initialState });
  return render(<Wrapper store={store}>{ui}</Wrapper>);
}

export { renderWithReduxStore };
