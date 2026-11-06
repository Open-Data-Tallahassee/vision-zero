import { SITE } from "@/config/site";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE.url}/#publisher`, name: SITE.publisher.name, url: SITE.publisher.url },
      { "@type": "WebSite", "@id": `${SITE.url}/#website`, name: SITE.name, url: SITE.url, description: SITE.description, publisher: { "@id": `${SITE.url}/#publisher` }, inLanguage: "en-US" },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
