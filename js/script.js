restoreInitialState();

const OPTION_KEYS = ["A", "B"];

function restoreInitialState() {
  const options = document.querySelectorAll(".option button");

  options.forEach((button, i) => {
    button.addEventListener("click", () => {
      updatePageWithOption(OPTION_KEYS[i]);
    });
  });
}

const CONTENT_FOR_OPTIONS = {
  A: {
    text: "Linket åbner en side med skolens logo, hvor du bliver bedt om  at indtaste din studieemail og kodeord.",
    image: {
      src: "img/optionA.png",
      alt: "skærmbillede", 
    },
    options: [
      "Jeg indtaster studieemail og password",
      "Jeg tjekker om URL-adressen i browseren er officiel",
    ],
  },
  B: {
    text: "Du ser at afsenderen af emailen har et mistænkeligt domænenavn i emailen.",
    image: {
      src: "img/optionB.png",
      alt: "skærmbillede", 
    },
    options: [
      "Jeg sletter e-mailen så hurtigt som muligt",
      "Jeg rapporterer e-mailen til skolens IT-afdeling og markerer den som SPAM",
    ],
  },
  AB: {
    text: "Du ser, at webadressen har et mistænkeligt domænenavn.",
    image: {
      src: "img/optionAB.png",
      alt: "skærmbillede", 
    },
    options: [
      "Jeg lukker siden så hurtigt som muligt og sletter e-mailen",
      "Jeg tager et skærmbillede og rapporterer siden til skolens IT-afdeling",
    ],
  },
};

function updatePageWithOption(option) {
  replaceText(option);
  replaceImage(option);
  replaceOptions(option);
}

function replaceText(option) {
  const textContainer = document.querySelector(".content .dynamic-text");
  textContainer.textContent = CONTENT_FOR_OPTIONS[option].text;
}

function replaceImage(option) {
  const imageElement = document.querySelector(".screenshot");
  imageElement.src = CONTENT_FOR_OPTIONS[option].image.src;
  imageElement.alt = CONTENT_FOR_OPTIONS[option].image.alt;
}

function replaceOptions(option) {
  const optionElements = document.querySelectorAll(".option");
  optionElements.forEach((optionElement, i) => {
    const optionText = optionElement.querySelector("p:nth-child(2)");
    optionText.textContent = CONTENT_FOR_OPTIONS[option].options[i];

    const optionButton = optionElement.querySelector("button");
    optionButton.addEventListener("click", () => {
      const optionText = `${option}${OPTION_KEYS[i]}`;
      if (optionText === "AB") {
        updatePageWithOption(optionText);
      } else {
        renderResultPage(optionText);
      }
    });
  });
}

const RESULT_PAGE_WRONG_OPTIONS = `<p class="error">Åh, nej! Du gik i fælden og er blevet scammet. ⚠️</p>

<p>Siden var falsk. Dine loginoplysninger er nu blevet sendt afsted til en hacker, og din emailadresse kan nu bruges til at sende phising-emails til  andre studerende og personalet fra skolen.</p>

<p>Selvom en email og hjemmeside bærer skolens logo, kan de være falske. Tjek altid afsenders email- og webadresse før du klikker videre eller opgiver personlige oplysninger.</p>

<button class="restart-button"><p><</p><p>Prøv igen</p></button>`;

const RESULT_PAGE_WARNING = `<p class="warning">Åh-åh! Du opdagede phising-angrebet, men du gjorde intet for at stoppe det. 😬</p>

<p>Da du ikke rapporterede angrebet til skolen, er andre studerende og personale måske stadig er i risiko for at blive scammet.</p>

<p>Rapportér altid phising, når du ser det.</p>

<button class="restart-button"><p><</p><p>Prøv igen</p></button>`;

const RESULT_PAGE_SUCCESS = `<p class="success">Pyha! Du opdagede phising-angrebet og satte en stopper for det. 👏</p>

<p>Skolens IT-afdeling bekræfter at emailen var falsk og et forsøg på phising.</p>

<p>Takket være dig, har skolen kunnet advare andre elever og forhindre angrebet i at sprede sig.</p>

<button class="restart-button"><p><</p><p>Prøv igen</p></button>`;

function renderResultPage(option) {
  const contentBody = document.querySelector(".content");
  switch (option) {
    case "AA":
      contentBody.innerHTML = RESULT_PAGE_WRONG_OPTIONS;
      setRestartButton();
      break;
    case "BA":
    case "ABA":
      contentBody.innerHTML = RESULT_PAGE_WARNING;
      setRestartButton();
      break;
    case "BB":
    case "ABB":
      contentBody.innerHTML = RESULT_PAGE_SUCCESS;
      setRestartButton();
      break;
    default:
      break;
  }
}

function setRestartButton() {
  const restartButton = document.querySelector(".restart-button");
  restartButton.addEventListener("click", () => window.location.reload());
}
