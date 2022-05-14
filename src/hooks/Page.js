import { useEffect } from "react";

const Page = (props) => {
  useEffect(() => {
    document.title = props.title || "즐청";
  }, [props.title]);
  return props.children;
};

export default Page;