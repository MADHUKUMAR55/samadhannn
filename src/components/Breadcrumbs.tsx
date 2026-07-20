import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            {item.href ? (
              <Link href={item.href} className="text-[#0f5c49] hover:underline" itemProp="item">
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="text-gray-700 font-medium" itemProp="name">{item.label}</span>
            )}
            <meta itemProp="position" content={String(idx + 1)} />
            {idx < items.length - 1 && <span className="mx-1 text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
