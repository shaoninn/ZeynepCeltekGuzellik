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

/** Site-wide: Header cart badge + product add-to-cart need shared store. */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartHydration />
      {children}
    </Provider>
  );
}
