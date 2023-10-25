jQuery.ajax({
  url: "https://saalzentrum-duesseldorf.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-3o5b4z/b/4/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=54badd66",
  type: "get",
  cache: true,
  dataType: "script"
});
window.ATL_JQ_PAGE_PROPS =  {
  "triggerFunction": function(showCollectorDialog) {
    //Requires that jQuery is available!
    jQuery("#myCustomTrigger").click(function(e) {
      console.log('Button clicked'); 
      e.preventDefault();
      showCollectorDialog();
    });
  }};
