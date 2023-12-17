# About

This repository explains how to configure puppeteer with a default (non-ejected) react app in order to test individual react components.

```js
describe("MyComponentOne", () => {
    it("should render with text",
        () => {
            return <MyComponentOne text="Hello World!" />;
        },
        async page => {
            await page.waitForSelector(".my-component-one");
            const text = await page.$eval(".my-component-one", el => el.innerHTML);
            expect(text).toBe("Hello World!");
        });
});
```

Please note that this repo is not a library. It's simply a guide on how to configure puppeteer with your own react application (without any additional dependencies).

## Why?

The default react testing library allows you to test individual components based on their DOM structure. In most cases it's enough, but sometimes you might want to write regression tests that compare the actual component's appearance with a reference image. This is especially useful when creating components that heavily rely on the HTML5 canvas element.

## Setup

**1. Create a new react app (or use an existing one)**

```bash
npx create-react-app my-app
cd my-app
```

**2. Install puppeteer**

Install the puppeteer that's compatible with your version of react-scripts (in this case: 18.1.0) and other test dependencies you may need.

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

Copy over the `src/utils/puppeteer-testing.js` file from this repo into your project. You can place it anywhere in your `src` folder.

```
├ public
├ src
│ ├ utils
│ │ └ puppeteer-testing.js
│ └ index.js
├ test-env
└ package.json
```

**5. Import the test utilities file into your test files**

They will override the default jest functions.

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
  <img src="https://github.com/TomaszRewak/react-app-puppeteer-component-testing/blob/master/src/Components/__image_snapshots__/__diff_output__/my-component-one-test-jsx-my-component-one-should-render-with-text-1-snap-diff.png?raw=true" width=600/>
</p>

## Good to know

- The provided code works only within the linux environment (including WSL). It can be adjusted to work with other operating systems by editing the `prestart` script in the `test-env/package.json` file (though it has not been tested).
- Your test files will be run both in the node environment and in the browser. In practice, the first callback of each test will be run in the browser, while the second one will be run in the node environment.
- It's good to avoid importing any node-specific modules in the global scope of your test files (as it will cause errors in the browser environment).
- It's best to obfuscate any imports that are not to be included in the browser environment (for example: `await import(["jest-image-snapshot"][0])`). This will prevent the browser from pre-fetching them.

