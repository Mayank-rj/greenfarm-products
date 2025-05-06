import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import './PolicyPage.css'
import { fetchPolicyPagebyTitle } from "../../api/fetchPolicyPagebyTitle";

const PolicyPage = () => {
  const location = useLocation();
  const { policyName } = useParams();

  const [policy, setPolicy] = useState("")
  const [sanitizedContent, setSanitizedContent] = useState("")

  const fetchpolicypage = async (policyName) => {
    try {
      const response = await fetchPolicyPagebyTitle(policyName);
      setPolicy(response.content);
    } catch (error) {
      console.error("Error fetching policy:", error);
    }
  };
  useEffect(() => {
    if (policyName) {
      fetchpolicypage(policyName)
    }

  }, [policyName])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  useEffect(() => {
    setSanitizedContent(DOMPurify.sanitize(policy))
  }, [policy])



  return (
    <div className="lg:mx-[60px] px-[15px] ">

      {policy ? (
        <div>
          <div
            className="policy"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>

      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PolicyPage;
