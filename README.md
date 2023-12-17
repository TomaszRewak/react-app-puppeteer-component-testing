# About

This repository explains how to configure puppeteer with a default (non-ejected) react app to test individual components.

Please note that this repo is not a library, but a guide to help you configure your own react app.

## Setup

**1. Create a new react app (or use an existing one)**

```bash
npx create-react-app my-app
cd my-app
```

**2. Install puppeteer**

Install the puppeteer that's compatible with your version of react-scripts (in this case, 18.1.0) and other test dependencies you may need.

```bash
npm install --save-dev puppeteer@18.1.0
npm install --save-dev jest-image-snapshot
```

**3. Create the test environment in you project root**

Copy over the `test-env` folder from this repo to your project root (just next to the `src` folder).

```
├ public
├ src
├ test-env
│ ├ public
│ ├ src
│ └ package.json
└ package.json
```

**4. Copy the test utilities file into your project**

Copy over the `src/utils/puppeteer-testing.js` file from this repo to your project. You can place it anywhere in your `src` folder.\

```
├ public
├ src
│ ├ utils
│ │ └ puppeteer-testing.js
│ └ index.js
├ test-env
└ package.json
```

**5. Import the test utilities file into your tests**

```js
import { describe, it, beforeAll } from "../utils/puppeteer-testing";
```

**6. Define your test cases**

```js
describe("MyComponentTwo", () => {
    beforeAll(async () => {
        const {toMatchImageSnapshot} = await import(["jest-image-snapshot"][0]);
        expect.extend({ toMatchImageSnapshot });
    });

    it("radius 10",
        () => {
            return <MyComponentTwo radius={10} />;
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
```

**7. Run your tests**

```bash
npm test
```

**8. View your test results**

<p>
  <img src="https://github.com/TomaszRewak/react-app-puppeteer-component-testing/blob/master/src/Components/__image_snapshots__/__diff_output__/my-component-two-test-jsx-my-component-two-radius-10-1-snap-diff.png?raw=true" width=400/>
</p>

