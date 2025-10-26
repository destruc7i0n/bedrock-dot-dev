import DocsContainer from "components/docs/docs-container";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function ContentSlot({ params }: Props) {
  const { slug } = await params;

  // Extract version and file from slug
  // slug is like ["beta", "Volumes"] or ["1.21.0.0", "1.21.130.22", "Volumes"]
  const file = slug[slug.length - 1];
  const minor = slug.length === 2 ? slug[0] : slug[1];

  return <DocsContainer slug={slug} version={minor} file={file} />;
}
