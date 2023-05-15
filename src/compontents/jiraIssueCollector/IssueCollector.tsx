import jQuery from 'jquery';
import {Row, Col, Button} from 'reactstrap'

const ELEMENT_ID = 'jira-feedback-button';
const WINDOW_VAR_NAME = 'jiraIssueCollector';
window['ATL_JQ_PAGE_PROPS'] = {
  "triggerFunction": function(showCollectorDialog) {
    jQuery(`#${ELEMENT_ID}`).click(function(e) {
      console.log('triggerFunction')
      e.preventDefault();
      showCollectorDialog();
    });
  }};

const IssueCollector = () => {
  const setCollector = () => {
    const appElement = document.querySelector('body');
    if (appElement) {
      console.log('loading issue collector');
      const snippet = document.createElement('script');
      snippet.type = 'text/javascript';
      snippet.src = "YOUR ISSUE COLLECTOR URL";
      appElement.appendChild(snippet);
    }
  };

  if (!window[WINDOW_VAR_NAME]) {
    setCollector();
    window[WINDOW_VAR_NAME] = this;
  }

  return (
    <Row>
      <Col>
        <Button href="#" color="primary" id={ELEMENT_ID}>
          Provide Feedback
        </Button>
      </Col>
    </Row>
  );
};

export default IssueCollector;
