"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

const getSnapshot = () => formatter.format(new Date());
const getServerSnapshot = () => "--:--:--";

export default function Clock() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <span className="tabular-nums">{time}</span>;
}
