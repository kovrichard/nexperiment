import React, { createContext, useContext, useEffect, useState } from "react";

export interface TestItems {
  [name: string]: TestItem;
}

interface TestItem {
  distribution?: number;
  A: string;
  B: string;
}

interface Variant {
  text: string;
  id: string;
}

interface ABTestItem {
  distribution: number;
  A: Variant;
  B: Variant;
}

interface ABTestContextType {
  items: TestItems;
  prefix: string;
}

const defaultContext: ABTestContextType = {
  items: {},
  prefix: "ab-test-",
};

const ABTestContext = createContext<ABTestContextType>(defaultContext);

export const ABTestProvider = ({
  children,
  items,
  prefix = "ab-test-",
}: {
  children: React.ReactNode;
  items: TestItems;
  prefix?: string;
}) => {
  return (
    <ABTestContext.Provider value={{ items, prefix }}>{children}</ABTestContext.Provider>
  );
};

function formatItem(name: string, prefix: string, item: TestItem): ABTestItem {
  const { A, B, distribution } = item;
  return {
    distribution: distribution || 0.5,
    A: {
      text: A,
      id: `${prefix}${name}-A`,
    },
    B: {
      text: B,
      id: `${prefix}${name}-B`,
    },
  };
}

export const useABTest = () => {
  const { items, prefix } = useContext(ABTestContext);
  const [isClient, setIsClient] = useState(false);

  if (!items) {
    throw new Error("useABTest must be used within a ABTestProvider");
  }

  useEffect(() => {
    setIsClient(true);

    Object.keys(items).forEach((name: string) => {
      const existing = localStorage.getItem(name);
      if (existing) return;

      const item = formatItem(name, prefix, items[name]);
      const chosenItem = Math.random() < item.distribution ? item.A : item.B;

      localStorage.setItem(name, JSON.stringify(chosenItem));
    });
  }, [items, prefix]);

  const getItem = (name: string) => {
    if (!isClient) return { text: "", id: "" };

    const item = localStorage.getItem(name);
    if (item) {
      return JSON.parse(item);
    }
  };

  return { getItem };
};
