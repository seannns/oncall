import React from "react";

export default function Schedule({ id, title }: { id: string; title: string }) {
  return (
    <div>
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-2 text-sm text-foreground">Schedule module (edit this file).</div>
    </div>
  );
}
