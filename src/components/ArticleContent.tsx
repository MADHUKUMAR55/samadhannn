"use client";

export default function ArticleContent({ html }: { html: string }) {
  return (
    <div
      className="prose max-w-none text-gray-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
