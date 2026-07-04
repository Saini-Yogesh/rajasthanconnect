import React from "react";

/** Render inline **bold** and *italic* within a text string. */
function renderInline(text, keyPrefix = "") {
  if (!text) return null;

  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldIdx = remaining.indexOf("**");
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);

    if (boldIdx === 0) {
      const end = remaining.indexOf("**", 2);
      if (end > 2) {
        parts.push(
          <strong key={`${keyPrefix}b${key++}`}>
            {remaining.slice(2, end)}
          </strong>
        );
        remaining = remaining.slice(end + 2);
        continue;
      }
    }

    if (italicMatch && italicMatch.index === 0) {
      parts.push(
        <em key={`${keyPrefix}i${key++}`}>{italicMatch[1]}</em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    const nextSpecial = [
      boldIdx >= 0 ? boldIdx : Infinity,
      italicMatch ? italicMatch.index : Infinity,
    ];
    const cut = Math.min(...nextSpecial);

    if (cut === Infinity) {
      parts.push(remaining);
      break;
    }

    if (cut > 0) {
      parts.push(remaining.slice(0, cut));
      remaining = remaining.slice(cut);
    } else {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }

  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}

/** Markdown horizontal rules: ---, ***, ___, =====, etc. */
function isHorizontalRule(line) {
  const trimmed = line.trim();
  return /^[-=*_]{3,}$/.test(trimmed);
}

/** Convert assistant markdown (headings, lists, bold, italic) to React nodes. */
export function MarkdownContent({ content }) {
  if (!content) return null;

  const lines = content.split("\n");
  const blocks = [];
  let listItems = [];
  let listType = null;

  const flushList = () => {
    if (!listItems.length) return;
    const ListTag = listType === "ol" ? "ol" : "ul";
    blocks.push(
      <ListTag key={`list-${blocks.length}`} className="mdList">
        {listItems.map((item, i) => (
          <li key={i}>{renderInline(item, `li${i}-`)}</li>
        ))}
      </ListTag>
    );
    listItems = [];
    listType = null;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    if (isHorizontalRule(trimmed)) {
      flushList();
      blocks.push(<hr key={idx} className="mdDivider" />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      blocks.push(
        <h4 key={idx} className="mdH4">
          {renderInline(trimmed.slice(4), `h4-${idx}-`)}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      blocks.push(
        <h3 key={idx} className="mdH3">
          {renderInline(trimmed.slice(3), `h3-${idx}-`)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList();
      blocks.push(
        <h3 key={idx} className="mdH3">
          {renderInline(trimmed.slice(2), `h1-${idx}-`)}
        </h3>
      );
      return;
    }

    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/);
    if (bulletMatch) {
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(bulletMatch[1]);
      return;
    }

    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (numberedMatch) {
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(numberedMatch[1]);
      return;
    }

    flushList();
    blocks.push(
      <p key={idx} className="mdParagraph">
        {renderInline(trimmed, `p-${idx}-`)}
      </p>
    );
  });

  flushList();
  return <div className="markdownContent">{blocks}</div>;
}
