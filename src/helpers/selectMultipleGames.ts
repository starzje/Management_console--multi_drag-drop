import { Game } from "../types/gameData"

/** vraća array game ID-ova od selektiranih igara */
export const selectMultipleGamesFn = (games:Game[], state:string[], gameId: string) => {
    const gameCopy = [...games]
    const firstGameSelected = games.find((id) => id.gameID === parseInt(state[0])) as Game
    const lastGameSelected = games.find((id) => id.gameID === parseInt(gameId)) as Game
    const firstGameIndex = games.indexOf(firstGameSelected)
    const secondGameIndex = games.indexOf(lastGameSelected)

    if (firstGameIndex > secondGameIndex) {
        /** ako se selektira prema gore, koristim kopiju arraya jer reverse mutatea originalni array */
        const sliced = gameCopy.slice( secondGameIndex , firstGameIndex  + 1).reverse() as Game[]
        const arrayOfSelectedGameIds = [sliced.map((id) => id.gameID)].toString().split(',')
        return [...arrayOfSelectedGameIds]
    } else {
        /** ako se selektira prema dolje */
        const sliced = games.slice(firstGameIndex, secondGameIndex + 1) as Game[]
        const arrayOfSelectedGameIds = [sliced.map((id) => id.gameID)].toString().split(',')
        return [...arrayOfSelectedGameIds]
    }
}