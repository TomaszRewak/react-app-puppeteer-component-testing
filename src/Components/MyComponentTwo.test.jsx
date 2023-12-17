import { describe, it, beforeAll } from "../utils/puppeteer-testing";
import MyComponentTwo from "./MyComponentTwo";

describe("MyComponentTwo", () => {
    beforeAll(async () => {
        const {toMatchImageSnapshot} = await import(["jest-image-snapshot"][0]);
        expect.extend({ toMatchImageSnapshot });
    });

    it("radius 10",
        () => {
            return <MyComponentTwo radius={20} />;
        },
        async page => {
            await page.waitForSelector(".my-component-two");
            const screenshot = await page.screenshot({clip: {x: 0, y: 0, width: 200, height: 200}});
            expect(screenshot).toMatchImageSnapshot();
        });

    it("radius 100",
        () => {
            return <MyComponentTwo radius={100} />;
        },
        async page => {
            await page.waitForSelector(".my-component-two");
            const screenshot = await page.screenshot({clip: {x: 0, y: 0, width: 200, height: 200}});
            expect(screenshot).toMatchImageSnapshot();
        });
});