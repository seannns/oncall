import React from "react";

type Message = {
  speaker: "caller" | "agent";
  text: string;
};

const PLACEHOLDER_TRANSCRIPT: Message[] = [
  { speaker: "agent", text: "Thank you for calling, my name is Sarah. How can I help you today?" },
  { speaker: "caller", text: "Hi Sarah, my name is John Matthews. I'm calling about a package I was supposed to receive." },
  { speaker: "agent", text: "Of course, I'd be happy to help with that. Could you provide me with your tracking number?" },
  { speaker: "caller", text: "Sure, it's TGEG110220." },
  { speaker: "agent", text: "Thank you. Let me pull that up for you... I can see your package was shipped on January 28th." },
  { speaker: "caller", text: "Right, but it was supposed to arrive yesterday and I still haven't received it." },
  { speaker: "agent", text: "I understand your concern. The tracking shows it's currently at our distribution center. Would you like me to arrange a redelivery?" },
  { speaker: "caller", text: "Yes please. Can you send it to a different address? I'll be at my office tomorrow." },
  { speaker: "agent", text: "Absolutely. What's the new delivery address?" },
  { speaker: "caller", text: "It's 742 Evergreen Terrace, Suite 200, Springfield." },
  { speaker: "agent", text: "Got it. And can I confirm the best contact number is still 0400123456?" },
  { speaker: "caller", text: "Actually, use my work number: 0327937264." },
];

// Who is currently "speaking" - for demo purposes
const CURRENT_SPEAKER: "caller" | "agent" | null = "agent";

// Patterns to highlight
const HIGHLIGHT_PATTERNS = [
  /\b[A-Z]{2,4}[-\s]?\d{4,}[-\s]?\d{2,}[-\s]?[A-Z]{0,2}\b/g, // Tracking numbers
  /\b\d{3}[-.]?\d{4}\b/g, // Phone numbers
  /\b\d+\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Terrace|Way|Boulevard|Blvd)[,.]?\s*(Suite|Ste|Apt|Unit|#)?\s*\d*[,.]?\s*[A-Z]?[a-z]*/gi, // Addresses
];

function highlightText(text: string): React.ReactNode[] {
  // Find all matches and their positions
  const matches: { start: number; end: number; text: string }[] = [];
  
  HIGHLIGHT_PATTERNS.forEach((pattern) => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      matches.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
    }
  });

  // Also highlight names after "my name is" or "name is"
  const namePattern = /(?:my name is|name is|I'm|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi;
  let nameMatch;
  while ((nameMatch = namePattern.exec(text)) !== null) {
    const nameStart = nameMatch.index + nameMatch[0].length - nameMatch[1].length;
    matches.push({ start: nameStart, end: nameStart + nameMatch[1].length, text: nameMatch[1] });
  }

  if (matches.length === 0) return [text];

  // Sort by start position and remove overlaps
  matches.sort((a, b) => a.start - b.start);
  const filtered: typeof matches = [];
  for (const m of matches) {
    if (filtered.length === 0 || m.start >= filtered[filtered.length - 1].end) {
      filtered.push(m);
    }
  }

  // Build result
  const result: React.ReactNode[] = [];
  let lastEnd = 0;
  filtered.forEach((m, i) => {
    if (m.start > lastEnd) {
      result.push(text.slice(lastEnd, m.start));
    }
    result.push(<strong key={i}>{m.text}</strong>);
    lastEnd = m.end;
  });
  if (lastEnd < text.length) {
    result.push(text.slice(lastEnd));
  }
  return result;
}

function TypingIndicator() {
  return (
    <span className="typing-indicator">
      <span className="typing-dot">.</span>
      <span className="typing-dot">.</span>
      <span className="typing-dot">.</span>
    </span>
  );
}

export default function Transcript({ id, title }: { id: string; title: string }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div>
      <div className="text-sm font-bold">TRANSCRIPT</div>
      <hr className="my-2 module-divider-inline" />

      <div 
        ref={scrollRef}
        className="border border-foreground overflow-y-auto text-xs space-y-3 p-3"
        style={{ maxHeight: "200px" }}
      >
        {PLACEHOLDER_TRANSCRIPT.map((msg, i) => {
          const isAgent = msg.speaker === "agent";
          return (
            <div key={i} className={`${isAgent ? "text-foreground/70 text-right" : "text-foreground text-left"}`}>
              <div className="font-semibold uppercase text-[10px] tracking-wide mb-0.5">
                {isAgent ? "Agent" : "Caller"}
              </div>
              <div>{highlightText(msg.text)}</div>
            </div>
          );
        })}
        {CURRENT_SPEAKER && (
          <div className={`${CURRENT_SPEAKER === "agent" ? "text-foreground/70 text-right" : "text-foreground text-left"}`}>
            <div className="font-semibold uppercase text-[10px] tracking-wide mb-0.5">
              {CURRENT_SPEAKER === "agent" ? "Agent" : "Caller"}
            </div>
            <TypingIndicator />
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button className="transcript-btn flex-1 py-2 px-3 text-xs font-semibold border border-foreground">
          H
        </button>
        <button className="transcript-btn flex-1 py-2 px-3 text-xs font-semibold border border-foreground">
          T
        </button>
        <button className="transcript-btn flex-1 py-2 px-3 text-xs font-semibold border border-foreground">
          #
        </button>
      </div>
    </div>
  );
}
