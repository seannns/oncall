import React from "react";

export default function KPIs({ id, title }: { id: string; title: string }) {
  return (
    <div>
      <div className="text-sm font-bold">{title}</div>
      <hr className="my-2 module-divider-inline" />

      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start">
          <div className="text-xs font-bold">YOUR CALLS</div>
          <div className="text-sm font-medium">72</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs font-bold">AHT</div>
          <div className="text-sm font-medium">5:32</div>
        </div>
      </div>
    </div>

  );
}
