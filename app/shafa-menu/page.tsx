import MenuExperience from "./MenuExperience";

const introGate = `(function(){try{var force=new URLSearchParams(window.location.search).get("intro")==="1";var seen=sessionStorage.getItem("shafa-intro-seen")==="1";if(force){sessionStorage.removeItem("shafa-intro-seen");}else if(seen){var gate=document.getElementById("shafa-intro-gate");if(!gate){gate=document.createElement("style");gate.id="shafa-intro-gate";gate.textContent="[data-splash-intro]{display:none!important}[data-shafa-menu]{opacity:1!important;transform:none!important;visibility:visible!important;pointer-events:auto!important}";document.head.appendChild(gate);}}}catch(error){}})();`;

export default function ShafaMenuPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: introGate }} />
      <MenuExperience />
    </>
  );
}
