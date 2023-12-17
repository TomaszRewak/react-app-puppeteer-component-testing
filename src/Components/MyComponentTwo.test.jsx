import { describe, it } from "../utils/puppeteer-testing";
import MyComponentTwo from "./MyComponentTwo";

if (typeof jest !== "undefined") {
    expect.extend({
        toMatchImageSnapshot: require("jest-image-snapshot").toMatchImageSnapshot
    });
}

describe("MyComponentTwo", () => {
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