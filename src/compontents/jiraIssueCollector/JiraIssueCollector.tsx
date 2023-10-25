// JiraIssueCollector.tsx
import React, { useEffect } from 'react';

const JiraIssueCollector: React.FC = () => {
  useEffect(() => {
    const scriptUrl = "https://saalzentrum-duesseldorf.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-3o5b4z/b/4/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=54badd66";

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      window.ATL_JQ_PAGE_PROPS = {
        "triggerFunction": function(showCollectorDialog: any) {
          // Requires that jQuery is available!
          jQuery("#myCustomTrigger").click(function(e) {
            e.preventDefault();
            showCollectorDialog();
          });
        }
      };
    };

    document.body.appendChild(script);

    // Cleanup: remove script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <button id="myCustomTrigger">Report an issue</button>
  );
};

export default JiraIssueCollector;
