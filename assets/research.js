"use strict";

// Explain the preserved Chinese dashboard without changing its research logic.
if(new URLSearchParams(location.search).get("lang")==="en"){
  document.querySelector("#research-language-note").hidden=false;
}
