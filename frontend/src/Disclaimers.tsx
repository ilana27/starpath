import "./styles/disclaimer.css";

// a wrapper component to list disclaimers

// e.g.: data privacy discalimer
// medical disclaimer & hotline phone #
export default function disclaimers() {
  return (
    <div className="disclaimers">
      <p className="initial-message">Hover to view disclaimer!</p>
      <div className="hover-text">
        <p>
          <b>Note on the suggestions:</b> We use your journal response to
          generate personalized suggestions using an open-source large language
          model and a recommendation algorithm
        </p>
        <p>
          This is not a substitute for medical support. If you are in crisis,
          please call the national mental health hotline at (806) 903-3787
        </p>
      </div>
    </div>
  );
}
