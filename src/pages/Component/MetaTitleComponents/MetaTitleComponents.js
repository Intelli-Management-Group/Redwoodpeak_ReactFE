import { useEffect } from 'react';

const MetaTitle = ({ pageTitle }) => {
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return null;
};

export default MetaTitle;
