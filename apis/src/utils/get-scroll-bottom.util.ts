import { Page } from "puppeteer";

export async function getScrollBottom(page: Page, className: string): Promise<number> {
    return await page.evaluate(() => {
        const ele = document.querySelector(`.${className}`);
        let result = -1
    
        if(ele) {
            ele.addEventListener('scroll', function () {
                const distanceFromTop = ele.scrollTop;
                const totalHeight = ele.scrollHeight;
                const distanceFromBottom = totalHeight - (distanceFromTop + ele.clientHeight);
                result = distanceFromBottom
            });
        }
    
        return result
    })
}