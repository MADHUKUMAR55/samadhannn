import Link from 'next/link';
import { Article } from '../types';
import { toCategoryName } from '../lib/categories';

export default function RelatedArticles({ articles, currentId }: { articles: Article[]; currentId: string }) {
  const related = articles.filter(a => a.id !== currentId).slice(0, 4);
  if (!related.length) return null;

  return (
    <section className="mt-8" aria-label="Related articles">
      <h2 className="text-xl font-bold text-[#17312a] mb-4 border-b border-[#dcece5] pb-2">Related Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(article => {
          const preview = article.content?.replace(/<[^>]+>/g, '').slice(0, 80) || '';
          return (
            <Link
              key={article.id}
              href={`/article/${article.slug || article.id}`}
              className="block bg-[#fffdf8] hover:bg-[#f1f7f3] rounded-xl p-4 border border-[#dfd8c9] hover:border-[#9dbfae] transition-all duration-200 group"
            >
              <span className="text-xs text-[#0f5c49] font-semibold">
                {toCategoryName(article.category)}
              </span>
              <h3 className="text-sm font-bold text-gray-900 mt-1 group-hover:text-[#0f5c49] transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{preview}...</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
