import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  path: string;
}

const SITE_URL = "https://mrzolotov.ru";
const OG_IMAGE = "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/9f8fc474-95d4-4d76-9e4b-ff5bed8c09e8.jpg";

const Seo = ({ title, description, path }: SeoProps) => {
  const url = `${SITE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
    </Helmet>
  );
};

export default Seo;
