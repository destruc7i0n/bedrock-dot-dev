import { getDocAlerts } from "lib/docs-alerts";
import DocsAlert from "./docs-alert";
import { getDocsHtml } from "app/docs/[...slug]/docs-data";

type DocsContainerProps = {
  slug: string[];
  version: string;
  file: string;
};

export default async function DocsContainer({
  slug,
  version,
  file,
}: DocsContainerProps) {
  const alerts = getDocAlerts(file, version);

  // Fetch HTML directly in this component
  const htmlData = await getDocsHtml(slug);

  if (!htmlData) {
    return null;
  }

  return (
    <div className="flex-1 w-0 bg-white dark:bg-dark-gray-900">
      <div className="pt-4 pr-5 pl-5 pb-5 lg:max-w-9/10 mx-auto">
        {alerts.map((alert, index) => (
          <DocsAlert key={`alert-${index}`} {...alert} />
        ))}
        <div
          className="docs-content text-gray-900 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: htmlData.displayHtml }}
        />
      </div>
    </div>
  );
}
