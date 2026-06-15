// Projekt af Camilla Grøn

/* Denne fil styrer det forgrenede phishing-scenarie.
   HTML'en indeholder startscenen, mens JavaScript opdaterer tekst,
   billede og valgmuligheder, når brugeren klikker sig videre. */

/* --------------------------------------------------------
 - START AF SCENARIET
 ---------------------------------------------------------- */

restoreInitialState(); /* Kalder startfunktionen med det samme, så de første knapper får event listeners, når scriptet loader */

const OPTION_KEYS = ["A", "B"]; /* Array med de to mulige valgnøgler. Index 0 svarer til A, og index 1 svarer til B */

function restoreInitialState() { /* Funktion der sætter den første interaktivitet op på startsiden */
  const options = document.querySelectorAll(".option button"); /* Finder alle knapper inde i elementer med class="option". querySelectorAll returnerer en NodeList */

  options.forEach((button, i) => { /* Gennemløber hver knap. button er den aktuelle knap, og i er knappens index i listen. [i] er en variabel for valgkoderne */
    button.addEventListener("click", () => { /* Event listener: Lytter efter klik på den aktuelle knap. Callback-funktionen kører først, når brugeren klikker */
      updatePageWithOption(OPTION_KEYS[i]); /* Bruger knappens index til at hente enten "A" eller "B" fra OPTION_KEYS og sender valget videre */
    });
  });
}

/* --------------------------------------------------------
 - DATA TIL MELLEMSCENER
 ---------------------------------------------------------- */

const CONTENT_FOR_OPTIONS = { /* Objekt der fungerer som en lille database over scenariets mellemtrin */
  A: { /* Scene A vises, hvis brugeren først vælger at klikke på linket */
    text: "Linket åbner en side med skolens logo, hvor du bliver bedt om  at indtaste din studieemail og kodeord.", /* Tekst som skal indsættes i .dynamic-text */
    image: { /* Billeddata til scene A */ 
      src: "img/optionA.png", /* Filsti til det billede, der skal vises */
      alt: "skærmbillede", /* Alt-tekst til billedet. Bruges af skærmlæsere og hvis billedet ikke loader */
    },
    options: [ /* Array med de to nye valgmuligheder i scene A */
      "Jeg indtaster studieemail og password", /* Mulighed A efter første A-valg. Fører til resultatkoden AA */
      "Jeg tjekker om URL-adressen i browseren er officiel", /* Mulighed B efter første A-valg. Fører til mellemtrinnet AB */
    ],
  },
  B: { /* Scene B vises, hvis brugeren først vælger at tjekke afsenderens emailadresse */
    text: "Du ser at afsenderen af emailen har et mistænkeligt domænenavn i emailen.", /* Tekst som forklarer konsekvensen af brugerens første sikre handling */
    image: { /* Billeddata til scene B */
      src: "img/optionB.png", /* Filsti til billedet for scene B */
      alt: "skærmbillede", /* Alt-tekst til billedet */
    },
    options: [ /* Array med de to valgmuligheder efter scene B */
      "Jeg sletter e-mailen så hurtigt som muligt", /* Mulighed A efter B-valg. Fører til advarselsresultatet BA */
      "Jeg rapporterer e-mailen til skolens IT-afdeling og markerer den som SPAM", /* Mulighed B efter B-valg. Fører til succesresultatet BB */
    ],
  },
  AB: { /* Ekstra mellemtrin, hvis brugeren først klikker på linket, men derefter tjekker URL-adressen */
    text: "Du ser, at webadressen har et mistænkeligt domænenavn.", /* Tekst som forklarer, at brugeren har opdaget noget mistænkeligt ved websiden */
    image: { /* Billeddata til scene AB */
      src: "img/optionAB.png", /* Filsti til billedet for scene AB */
      alt: "skærmbillede", /* Alt-tekst til billedet */
    },
    options: [ /* Array med de to sidste valgmuligheder i AB-grenen */
      "Jeg lukker siden så hurtigt som muligt og sletter e-mailen", /* Mulighed A efter AB. Fører til advarselsresultatet ABA */
      "Jeg tager et skærmbillede og rapporterer siden til skolens IT-afdeling", /* Mulighed B efter AB. Fører til succesresultatet ABB */
    ],
  },
};

/* --------------------------------------------------------
 - FUNKTIONER DER OPDATERER SIDEN
 ---------------------------------------------------------- */

function updatePageWithOption(option) { /* Samlet funktion der opdaterer scenariet ud fra brugerens valg */
  replaceText(option);    /* Opdaterer scenarieteksten */
  replaceImage(option);   /* Opdaterer billedet */
  replaceOptions(option); /* Opdaterer valgmulighederne */ 
}

function replaceText(option) { /* Funktion der skifter teksten i scenariet */
  const textContainer = document.querySelector(".content .dynamic-text"); /* Finder p-tagget med scenarieteksten inde i .content */
  textContainer.textContent = CONTENT_FOR_OPTIONS[option].text; /* Bruger option som nøgle i dataobjektet og indsætter den nye tekst i DOM'en */
}

function replaceImage(option) { /* Funktion der skifter billedet i scenariet */
  const imageElement = document.querySelector(".screenshot"); /* Finder billed-elementet i DOM'en */
  imageElement.src = CONTENT_FOR_OPTIONS[option].image.src; /* Skifter billedets src-attribut til billedet fra den aktuelle scene */
  imageElement.alt = CONTENT_FOR_OPTIONS[option].image.alt; /* Skifter også alt-teksten, så billedets beskrivelse følger med scenen */
}

function replaceOptions(option) { /* Funktion der udskifter teksten på valgmulighederne og giver knapperne ny klik-logik */
  const optionElements = document.querySelectorAll(".option"); /* Finder alle li-elementer med class="option" */
  optionElements.forEach((optionElement, i) => { /* Gennemløber hvert option-element. i bruges til at hente den rigtige A/B-værdi. Dette kaldes en array-/NodeList-iteration method, som fungerer som et loop, hvor javascript selv laver udregningen for mig */
    const optionText = optionElement.querySelector("p:nth-child(2)"); /* Finder det andet p-tag inde i knappen, altså selve valgteksten */
    optionText.textContent = CONTENT_FOR_OPTIONS[option].options[i]; /* Udskifter knapteksten med den tekst, der passer til den aktuelle scene og knap */

    const optionButton = optionElement.querySelector("button"); /* Finder selve button-elementet inde i den aktuelle option */
    optionButton.addEventListener("click", () => { /* Tilføjer en ny click-event listener til knappen */
      const optionText = `${option}${OPTION_KEYS[i]}`; /* Template literal. Her bygges en valgkode ved at sætte tidligere valg sammen med nyt A/B-valg, fx A + B = AB.
                                                          En template literal er en string skrevet med backticks, hvor man kan sætte variabler direkte ind med ${...}. 
                                                          Man kan forstå detr sådan her:const optionText = tidligereValg + nytValg; */
                                                          
      if (optionText === "AB") { /* Conditional statement: AB er den eneste valgkode, der skal føre til et ekstra mellemtrin */
        updatePageWithOption(optionText); /* Viser mellemtrinnet AB ved at opdatere tekst, billede og valgmuligheder igen */
      } else { /* Alle andre valgkoder er slutninger */
        renderResultPage(optionText); /* Sender valgkoden videre til funktionen, der viser den rigtige resultatside */
      }
    });
  });
}

/* --------------------------------------------------------
 - HTML-TEMPLATES TIL RESULTATSIDER
 ---------------------------------------------------------- */

const RESULT_PAGE_WRONG_OPTIONS = `<p class="error">Åh, nej! Du gik i fælden og er blevet scammet. ⚠️</p>

<p>Siden var falsk. Dine loginoplysninger er nu blevet sendt afsted til en hacker, og din emailadresse kan nu bruges til at sende phising-emails til  andre studerende og personalet fra skolen.</p>

<p>Selvom en email og hjemmeside bærer skolens logo, kan de være falske. Tjek altid afsenders email- og webadresse før du klikker videre eller opgiver personlige oplysninger.</p>

<button class="restart-button"><p><</p><p>Prøv igen</p></button>`; /* Template literal med HTML til den dårlige slutning, hvor brugeren falder for phishing */

const RESULT_PAGE_WARNING = `<p class="warning">Åh-åh! Du opdagede phising-angrebet, men du gjorde intet for at stoppe det. 😬</p>

<p>Da du ikke rapporterede angrebet til skolen, er andre studerende og personale måske stadig er i risiko for at blive scammet.</p>

<p>Rapportér altid phising, når du ser det.</p>

<button class="restart-button"><p><</p><p>Prøv igen</p></button>`; /* Template literal med HTML til advarsels-slutningen, hvor brugeren opdager phishing, men ikke rapporterer det */

const RESULT_PAGE_SUCCESS = `<p class="success">Pyha! Du opdagede phising-angrebet og satte en stopper for det. 👏</p>

<p>Skolens IT-afdeling bekræfter at emailen var falsk og et forsøg på phising.</p>

<p>Takket være dig, har skolen kunnet advare andre elever og forhindre angrebet i at sprede sig.</p>

<button class="restart-button"><p><</p><p>Prøv igen</p></button>`; /* Template literal med HTML til succes-slutningen, hvor brugeren rapporterer phishing-angrebet */

/* --------------------------------------------------------
 - RENDERING AF RESULTATSIDE
 Alle muligheder, undtagen AB, som fører til en mellemscene, of styres af if (optionText === "AB") oppe i "FUNKTIONER DER STYRER SIDEN!"
 ---------------------------------------------------------- */

function renderResultPage(option) { /* Funktion der vælger og viser den rigtige slutning baseret på brugerens valgkode */
  const contentBody = document.querySelector(".content"); /* Finder hele scenariets main-container, så indholdet kan udskiftes */
  switch (option) { /* Switch statement: Matcher valgkoden med den resultatside, der skal vises */
    case "AA": /* Brugeren klikker på linket og indtaster loginoplysninger */
      contentBody.innerHTML = RESULT_PAGE_WRONG_OPTIONS; /* AA udskifter hele .content med HTML'en for den dårlige slutning */
      setRestartButton(); /* Tilføjer click-event til Prøv igen-knappen, efter den er blevet indsat i DOM'en */
      break; /* Stopper switch, når den rigtige case er fundet */
    case "BA": /* Brugeren opdager mistænkelig afsender, men sletter bare e-mailen */
    case "ABA": /* Brugeren opdager mistænkelig URL, men rapporterer ikke angrebet */
      contentBody.innerHTML = RESULT_PAGE_WARNING; /* BA og ABA udskifter hele .content med HTML'en for advarsels-slutningen */
      setRestartButton(); /* Aktiverer Prøv igen-knappen */
      break; /* Stopper switch */
    case "BB": /* Brugeren rapporterer den falske e-mail */
    case "ABB": /* Brugeren rapporterer den falske webside */
      contentBody.innerHTML = RESULT_PAGE_SUCCESS; /* BB og ABB udskifter hele .content med HTML'en for succes-slutningen */
      setRestartButton(); /* Aktiverer Prøv igen-knappen */
      break; /* Stopper switch */
    default: /* Hvis option ikke matcher nogen kendt valgkode, sker der ikke noget */
      break;
  }
}

/* --------------------------------------------------------
 - PRØV IGEN-KNAP
 ---------------------------------------------------------- */

function setRestartButton() { /* Funktion der gør Prøv igen-knappen klikbar */
  const restartButton = document.querySelector(".restart-button"); /* Finder restart-knappen, som først findes i DOM'en efter innerHTML har indsat resultatsiden */
  restartButton.addEventListener("click", () => window.location.reload()); /* Når brugeren klikker, genindlæses siden, så scenariet starter forfra */
}
