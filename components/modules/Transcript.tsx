import React from "react";

export default function Transcript({ id, title }: { id: string; title: string }) {
  return (
    <div>
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-2 text-sm text-foreground">Live transcript module (edit this file).</div>
    </div>
  );
}
