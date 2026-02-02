import React from "react";

export default function KPIs({ id, title }: { id: string; title: string }) {
  return (
    <div>
      <div className="text-sm font-bold">{title}</div>
      <hr className="my-2 module-divider-inline" />

      <div className="flex items-center justify-between w-full text-xs">
        <div className="flex flex-col items-start">
          <div className="text-foreground/60 text-[10px] uppercase tracking-wide">Your Calls</div>
          <div className="font-semibold">72</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-foreground/60 text-[10px] uppercase tracking-wide">AHT</div>
          <div className="font-semibold">5:32</div>
        </div>
      </div>
    </div>

  );
}
