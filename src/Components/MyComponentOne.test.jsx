import { describe, it } from "../utils/puppeteer-testing";
import MyComponentOne from "./MyComponentOne";

if (typeof jest !== "undefined") {
    expect.extend({
        toMatchImageSnapshot: require("jest-image-snapshot").toMatchImageSnapshot
    });
}

describe("MyComponentOne", () => {
    it("should render with text",
        () => {
            return <MyComponentOne text="Hello world!!!!" />;
        },
        async page => {
            await page.waitForSelector(".my-component-one");
            const screenshot = await page.screenshot({clip: {x: 0, y: 0, width: 300, height: 100}});
            expect(screenshot).toMatchImageSnapshot();
        });

    it("should render without text",
        () => {
            return <MyComponentOne />;
        },
        async page => {
            await page.waitForSelector(".my-component-one");
            const screenshot = await page.screenshot({clip: {x: 0, y: 0, width: 300, height: 100}});
            expect(screenshot).toMatchImageSnapshot();
        });
});