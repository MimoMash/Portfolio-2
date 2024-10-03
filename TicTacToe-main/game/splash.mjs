import { ANSI } from "./ansi.mjs";

const ART = `
${ANSI.COLOR.BLUE} ______  ____    _____     ${ANSI.COLOR.YELLOW}  ______   ____    _____   ${ANSI.COLOR.RED}   ______   ___   ______
${ANSI.COLOR.BLUE}|      ||    |  /  ___|    ${ANSI.COLOR.YELLOW} |      | /    |  /  ___]  ${ANSI.COLOR.RED}  |      | /   \\ |  ____]
${ANSI.COLOR.BLUE}|      | |  |  /  /        ${ANSI.COLOR.YELLOW} |      ||  o  | /  /      ${ANSI.COLOR.RED}  |      ||  _  || [__
${ANSI.COLOR.BLUE}|_|  |_| |  | |  /         ${ANSI.COLOR.YELLOW} |_|  |_||     ||  /       ${ANSI.COLOR.RED}  |_|  |_|| | | ||   _]
${ANSI.COLOR.BLUE}  |  |   |  | |  \\        ${ANSI.COLOR.YELLOW}    |  |  |  _  ||  \\    ${ANSI.COLOR.RED}       |  |  | |_| ||  [__
${ANSI.COLOR.BLUE}  |  |   |  |  \\  \\___     ${ANSI.COLOR.YELLOW}   |  |  |  |  | \\  \\___    ${ANSI.COLOR.RED}   |  |  |     ||     |
${ANSI.COLOR.BLUE}  |__|  |____|  \\_____|   ${ANSI.COLOR.YELLOW}    |__|  |__|__|  \\_____|   ${ANSI.COLOR.RED}   |__|   \\___/ |_____|
${ANSI.RESET}
`

function showSplashScreen() {
    console.log(ART);
}

export default showSplashScreen;