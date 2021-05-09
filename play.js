const maxRounds = 3;
let options = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let pattern = [];

let userStarts = true;
let initRobot = true;
let robotPicks = false;
let marker = true;

let userWins = 0;
let robotWins = 0;
let roundsPassed = 0;
let repeat = false;

let x1 = "";
let x2 = "";
let x3 = "";
let x4 = "";
let x5 = "";
let x6 = "";
let x7 = "";
let x8 = "";
let x9 = "";

const showSymbol = (symbol, elementId) => {
    document.getElementById(elementId).innerHTML = symbol;
    options = options.filter(element => element !== elementId);
    marker = (!marker);
};

const isAvailableOption = (option) => {
    return (options.includes(option) && document.getElementById(option).innerText === "");
};

const isTakenByUser = (option) => {
    return (document.getElementById(option).innerText === "x");
};

const updateFieldSpots = () => {
    x1 = (document.getElementById("1").innerText) ? document.getElementById("1").innerText : "";
    x2 = (document.getElementById("2").innerText) ? document.getElementById("2").innerText : "";
    x3 = (document.getElementById("3").innerText) ? document.getElementById("3").innerText : "";
    x4 = (document.getElementById("4").innerText) ? document.getElementById("4").innerText : "";
    x5 = (document.getElementById("5").innerText) ? document.getElementById("5").innerText : "";
    x6 = (document.getElementById("6").innerText) ? document.getElementById("6").innerText : "";
    x7 = (document.getElementById("7").innerText) ? document.getElementById("7").innerText : "";
    x8 = (document.getElementById("8").innerText) ? document.getElementById("8").innerText : "";
    x9 = (document.getElementById("9").innerText) ? document.getElementById("9").innerText : "";
};

const getOptions = () => {
    return [
        {"1": x1, "2": x2, "3": x3},
        {"4": x4, "5": x5, "7": x6},
        {"7": x7, "8": x8, "9": x9},
        {"1": x1, "4": x4, "7": x7},
        {"2": x2, "5": x5, "8": x8},
        {"3": x3, "6": x6, "9": x9},
        {"1": x1, "5": x5, "9": x9},
        {"3": x3, "5": x5, "7": x7}
    ];
};

const getOptionsForDefend = () => {
    const options = getOptions();

    for (let row of options) {
        Object.entries(row).map((element) => {
            if (element[1] === "x") {
                delete row[element[0]];
            }
        })
    }

    return options;
};

const getPositionForDefend = () => {
    return getOptionsForDefend().filter((element) => {
        if (Object.keys(element).length === 1 && Object.values(element)[0] === "") {
            return Object.keys(element);
        }
    });
};

const getOptionsForAttack = () => {
    const options = getOptions();

    for (let row of options) {
        Object.entries(row).map((element) => {
            if (element[1] === "o") {
                delete row[element[0]];
            }
        })
    }

    return options;
};

const getPositionForAttack = () => {
    return getOptionsForAttack().filter((element) => {
        if (Object.keys(element).length === 1 && Object.values(element)[0] === "") {
            return Object.keys(element);
        }
    });
};

const haveIWon = () => {
    updateFieldSpots();

    let win = false;
    if (x1 !== "" && x1 === x2 && x2 === x3) {
        win = true;
    } else if (x4 !== "" && x4 === x5 && x5 === x6) {
        win = true;
    } else if (x7 !== "" && x7 === x8 && x8 === x9) {
        win = true;
    } else if (x1 !== "" && x1 === x4 && x4 === x7) {
        win = true;
    } else if (x2 !== "" && x2 === x5 && x5 === x8) {
        win = true;
    } else if (x3 !== "" && x3 === x6 && x6 === x9) {
        win = true;
    } else if (x1 !== "" && x1 === x5 && x5 === x9) {
        win = true;
    } else if (x3 !== "" && x3 === x5 && x5 === x7) {
        win = true;
    }

    return win;
};

const completed = () => {
    return (
        x1 !== "" &&
        x2 !== "" &&
        x3 !== "" &&
        x4 !== "" &&
        x5 !== "" &&
        x6 !== "" &&
        x7 !== "" &&
        x8 !== "" &&
        x9 !== ""
    )
};

const findBestSpot = () => {
    updateFieldSpots();

    const positionForDefend = getPositionForDefend();
    const positionForAttack = getPositionForAttack();
    if (pattern.length === 0) {
        getPattern();
    }

    if (positionForAttack.length > 0 && Object.keys(positionForAttack[0]) > 0) {
        return Object.keys(positionForAttack[0])[0];
    } else if (positionForDefend.length > 0 && Object.keys(positionForDefend[0]) > 0) {
        return Object.keys(positionForDefend[0])[0];
    } else if (pattern.length > 0) {
        if (patternIsApplicable()) {
            for (let spot of pattern) {
                if (isAvailableOption(spot)) {
                    return spot.toString();
                }
            }
        }

        getPattern();
        if (pattern.length === 0 && !patternIsApplicable()) {
            return getRandomOption();
        } else {
            for (let spot of pattern) {
                if (isAvailableOption(spot)) {
                    return spot;
                }
            }
        }
    } else {
        return false;
    }
};

const findIfWon = (playerSymbol) => {
    updateFieldSpots();
    const allOptions = getOptions();

    for (let row of allOptions) {
        Object.entries(row).map((element) => {
            if (element[1] === playerSymbol) {
                delete row[element[0]];
            }
        })
    }

    const threes = allOptions.filter((element) => {
        if (Object.keys(element).length === 0) {
            return Object.keys(element);
        }
    });
    return (threes.length > 0);
};

const win = (winner) => {
    blockClicks();
    if (
        roundsPassed < maxRounds &&
        userWins <= 1 &&
        robotWins <= 1 &&
        !repeat
    ) {
        roundsPassed++;
        reset();
    } else if (repeat) {
        reset();
    } else {
        endGame(winner);
    }
};

const blockClicks = () => {
    for (let i = 1; i < 10; i++) {
        document.getElementById(i.toString()).onclick = () => {
        };
    }
};

const reset = () => {
    for (let i = 1; i < 10; i++) {
        document.getElementById(i.toString()).innerText = "";
    }
    options = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    marker = true;
    initRobot = true;
    pattern = [];
    changeOrder();
    play();
};

const pickPosition = () => {
    return findBestSpot();
};

const hasPicked = (robotPick) => {
    return robotPick
};

const getRandomOption = () => {
    while (true) {
        const randomOption = Math.floor(Math.random() * 10).toString();
        if (isAvailableOption(randomOption)) {
            return randomOption;
        }
    }
};

const robotsTurn = () => {
    return (!marker && options.length > 0 && !haveIWon());
};

const robot = () => {
    const robotPick = pickPosition();

    setTimeout(() => {
        showSymbol("o", robotPick);

        if (haveIWon()) {
            robotWins++;
            document.getElementById("robot").innerText = `ROBOT ${robotWins}`;
            win("Robot won!");
        }

        if (completed()) {
            finish();
        }

        robotPicks = false;
    }, (document.getElementById("stage").classList.contains("zoomIn")) ? 2500 : 1000);
};

const finish = () => {
    if (findIfWon("x")) {
        userWins++;
        document.getElementById("user").innerText = `${userWins} USER`;
        win("User won!");
    } else if (findIfWon("o")) {
        robotWins++;
        document.getElementById("robot").innerText = `ROBOT ${robotWins}`;
        win("Robot won!")
    } else {
        repeat = true;
        win("It's a draw!");
    }
};

const displayWinner = (winner) => {
    document.getElementById("message").innerText = winner;
    document.getElementById("message").classList.add("zoomIn");
    document.getElementById("finish").classList.remove("isHidden");
    document.getElementById("finish").classList.add("finish");
    document.getElementById("toggle").classList.remove("isHidden");
    document.getElementById("question").classList.remove("isHidden");
}

const endGame = (winner) => {
    for (let i = 1; i < 10; i++) {
        document.getElementById(i.toString()).innerText = "";
    }
    options = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    marker = true;
    initRobot = true;
    roundsPassed = 0;
    displayWinner(winner);

    document.getElementById("reset").onclick = () => {
        userWins = 0;
        robotWins = 0;
        document.getElementById("user").innerText = `${userWins} USER`;
        document.getElementById("robot").innerText = `ROBOT ${robotWins}`;
        document.getElementById("message").classList.remove("zoomIn");
        document.getElementById("finish").classList.remove("finish");
        document.getElementById("finish").classList.add("isHidden");
        play();
    }
};

const markWhoStarts = () => {
    if (userStarts) {
        document.getElementById("user").style.color = "aquamarine";
        document.getElementById("robot").style.color = "black";
        document.getElementById("toggle_checkbox").checked = false;
    } else {
        document.getElementById("user").style.color = "black";
        document.getElementById("robot").style.color = "aquamarine";
        document.getElementById("toggle_checkbox").checked = true;
    }
};

const changeOrder = () => {
    userStarts = !userStarts;
    markWhoStarts();
};

const showStageMessage = (message) => {
    document.getElementById("stage").innerText = message;
    document.getElementById("stage").classList.contains("zoomOut");
    if (document.getElementById("stage").classList.contains("zoomOut")) {
        document.getElementById("stage").classList.remove("zoomOut");
    }
    document.getElementById("stage").style.zIndex = "1";
    document.getElementById("stage").classList.add("zoomIn");
    setTimeout(() => {
        document.getElementById("stage").classList.remove("zoomIn");
        document.getElementById("stage").classList.add("zoomOut");
        setTimeout(() => {
            document.getElementById("stage").style.zIndex = "-1";
        }, 1000)
    }, 2000);
};

const announceRound = () => {
    if (repeat) {
        showStageMessage("Replay");
        repeat = false;
        return;
    }

    switch (roundsPassed + 1) {
        case 1:
            showStageMessage("Round One");
            break;
        case 2:
            showStageMessage("Round Two");
            break;
        case 3:
            showStageMessage("Final Round");
            break;
    }
};

const blockChangeOfRow = () => {
    document.getElementById("toggle").classList.add("isHidden");
    document.getElementById("question").classList.add("isHidden");
};

const play = () => {
    announceRound();
    blockChangeOfRow();

    if (!userStarts) {
        marker = false;
        robotPicks = true;
        robot();
    }

    for (let option of options) {
        document.getElementById(option).onclick = (() => {
            if (document.getElementById(option).innerText !== "") return;
            if (robotPicks) return;

            showSymbol("x", option);

            if (robotsTurn()) {
                robotPicks = true;
                robot();
            } else {
                finish();
            }
        });
    }
};

const getTrianglePattern = () => {
    let pattern = [];
    if (empty(x1) && empty(x7) && empty(x9)) {
        pattern = ["1", "7", "9"];
    } else if (empty(x7) && empty(x9) && empty(x3)) {
        pattern = ["5", "1", "3"];
    } else if (empty(x9) && empty(x3) && empty(x1)) {
        pattern = ["9", "3", "1"];
    } else if (empty(x3) && empty(x1) && empty(x7)) {
        pattern = ["3", "1", "7"];
    }
    return pattern;
};

const getFivePattern = () => {
    let pattern = [];
    if (empty(x5)) {
        if (empty(x1) && empty(x7)) {
            pattern = ["5", "1", "7"];
        } else if (empty(x1) && empty(x3)) {
            pattern = ["5", "1", "3"];
        } else if (empty(x3) && empty(x9)) {
            pattern = ["5", "3", "9"];
        } else if (empty(x9) && empty(x7)) {
            pattern = ["5", "9", "7"];
        }
    }
    return pattern;
};

const getLinePattern = () => {
    let pattern = [];
    if (empty(x1) && empty(x2) && empty(x3)) {
        pattern = ["1", "2", "3"];
    } else if (empty(x4) && empty(x5) && empty(x6)) {
        pattern = ["4", "5", "6"];
    } else if (empty(x7) && empty(x8) && empty(x9)) {
        pattern = ["7", "8", "9"];
    } else if (empty(x1) && empty(x5) && empty(x9)) {
        pattern = ["1", "5", "9"];
    } else if (empty(x3) && empty(x5) && empty(x7)) {
        pattern = ["3", "5", "7"];
    }
    return pattern;
};

const getPattern = () => {
  const trianglePattern = getTrianglePattern();
  const fivePattern = getFivePattern();
  const linePattern = getLinePattern();
  if (trianglePattern.length > 0) {
      pattern = trianglePattern;
  } else if (fivePattern.length > 0) {
      pattern = fivePattern;
  } else if (linePattern.length > 0) {
      pattern = linePattern;
  }

  console.log({pattern})
};

const patternIsApplicable = () => {
    for (const option of pattern) {
        if (!isAvailableOption(option) && isTakenByUser(option)) {
            return false;
        }
    }
    return true;
};

const patternCanWin = (pattern) => {
    if (patternIsApplicable()) {

    }
};

const empty = (box) => {
    return (box === "" || box === "o");
};

(() => {
    markWhoStarts();

    document.getElementById("toggle_checkbox").onclick = () => {
        changeOrder();
    };

    document.getElementById("begin").onclick = () => {
        document.getElementById("start").classList.add("isHidden");
        play();
    }
})();
