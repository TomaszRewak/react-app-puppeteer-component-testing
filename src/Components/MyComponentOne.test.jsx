import { describe, it, beforeAll } from "../utils/puppeteer-testing";
import MyComponentOne from "./MyComponentOne";

describe("MyComponentOne", () => {
    beforeAll(async () => {
        const { toMatchImageSnapshot } = await import(["jest-image-snapshot"][0]);
        expect.extend({ toMatchImageSnapshot });
    });

    it("should render with text",
        () => {
            return <MyComponentOne text="▯▯▯▯▯▯▯▯▯!" />;
        },
        async page => {
            await page.waitForSelector(".my-component-one");
            const screenshot = await page.screenshot({ clip: { x: 0, y: 0, width: 200, height: 80 } });
            expect(screenshot).toMatchImageSnapshot();
        });

    it("should render without text",
        () => {
            return <MyComponentOne />;
        },
        async page => {
            await page.waitForSelector(".my-component-one");
            const screenshot = await page.screenshot({ clip: { x: 0, y: 0, width: 200, height: 80 } });
            expect(screenshot).toMatchImageSnapshot();
        });
});