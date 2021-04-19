const maxRounds = 3;
let options = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

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

    if (positionForAttack.length > 0 && Object.keys(positionForAttack[0]) > 0) {
        return Object.keys(positionForAttack[0])[0];
    } else if (positionForDefend.length > 0 && Object.keys(positionForDefend[0]) > 0) {
        return Object.keys(positionForDefend[0])[0];
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
    console.log(`Here ${repeat}`);
    changeOrder();
    play();
};

const pickPosition = () => {
    if (initRobot) {
        initRobot = false;
        return getRandomOption();
    } else {
        const robotPick = findBestSpot();
        if (!hasPicked(robotPick) || !isAvailableOption(robotPick)) {
            return getRandomOption();
        }

        return robotPick
    }
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
    }, 2500);
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

const endGame = (winner) => {
    for (let i = 1; i < 10; i++) {
        document.getElementById(i.toString()).innerText = "";
    }
    document.getElementById("message").innerText = winner;
    document.getElementById("finish").classList.remove("isHidden");
    document.getElementById("finish").classList.add("finish");
    document.getElementById("toggle").classList.remove("isHidden");
    document.getElementById("question").classList.remove("isHidden");
    options = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    marker = true;
    initRobot = true;
    userWins = 0;
    robotWins = 0;
    document.getElementById("robot").innerText = `${userWins} USER`;
    document.getElementById("robot").innerText = `ROBOT ${robotWins}`;
    roundsPassed = 0;
    document.getElementById("reset").onclick = () => play();
};

const markWhoStarts = () => {
    if (userStarts) {
        document.getElementById("user").style.color = "aquamarine";
        document.getElementById("robot").style.color = "black";
    } else {
        document.getElementById("user").style.color = "black";
        document.getElementById("robot").style.color = "aquamarine";
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
        document.getElementById("stage").style.zIndex = "-1";
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
            showStageMessage("First Round");
            break;
        case 2:
            showStageMessage("Second Round");
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

(() => {
    document.getElementById("toggle_checkbox").onclick = () => {
        changeOrder();
    };

    document.getElementById("begin").onclick = () => {
        document.getElementById("start").classList.add("isHidden");
        markWhoStarts();
        play();
    }
})();
