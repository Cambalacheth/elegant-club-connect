
import { useParams } from "react-router-dom";
import DomainPage from "./DomainPage";

const VerticalDomainPage = () => {
  const { verticalPath } = useParams<{ verticalPath: string }>();
  return <DomainPage />;
};

export default VerticalDomainPage;
