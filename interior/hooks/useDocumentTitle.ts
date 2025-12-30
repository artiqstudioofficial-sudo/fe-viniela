
import { useEffect } from 'react';

export const useDocumentTitle = (title: string, description?: string) => {
  useEffect(() => {
    // Update Title
    document.title = `${title} | Viniela Interior`;

    // Update Meta Description dynamically if provided
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = description;
        document.getElementsByTagName('head')[0].appendChild(meta);
      }

      // Also update OG description for consistency
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
};
