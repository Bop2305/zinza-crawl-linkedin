import { Logger } from "@nestjs/common"

export const statusLog = (section: string, message: string, scraperSessionId?: string | number) => {
    const sessionPart = (scraperSessionId) ? ` (${scraperSessionId})` : ''
    const messagePart = (message) ? `: ${message}` : null

    return Logger.log(`(${section})${sessionPart}${messagePart}`)
}