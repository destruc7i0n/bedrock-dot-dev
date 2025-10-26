import Sidebar from "components/sidebar";
import { notFound } from "next/navigation";
import { getDocsData } from "../docs-data";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function SidebarSlot({ params }: Props) {
  const { slug } = await params;
  const data = await getDocsData(slug);

  if (!data) {
    notFound();
  }

  const { file, sidebar } = data;

  return <Sidebar sidebar={sidebar} file={file} loading={false} />;
}
