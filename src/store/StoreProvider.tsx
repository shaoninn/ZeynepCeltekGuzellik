"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { hydrateCart } from "./cartSlice";

function CartHydration() {
  useEffect(() => {
    store.dispatch(hydrateCart());
  }, []);
  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartHydration />
      {children}
    </Provider>
  );
}
