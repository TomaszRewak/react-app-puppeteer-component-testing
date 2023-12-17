let hasJest = typeof jest !== 'undefined';

export const componentFactories = {};
let contextName = '';

function killServer() {
    try { require('child_process').execSync('kill $(lsof -t -i:3111)'); }
    catch (error) { }
}

export function describe(name, fn) {
    contextName = name;

    if (hasJest) {
        require('@jest/globals').describe(name, () => {
            fn();

            require('@jest/globals').beforeAll(async () => {
                killServer();

                require('child_process').exec('npm start', {
                    cwd: process.cwd() + '/test-env',
                    env: {
                        ...process.env,
                        REACT_APP_FILE_NAME: module.parent.filename.replace(process.cwd() + '/', './'),
                        PORT: 3111
                    }
                });

                const browser = await require('puppeteer').launch();
                const page = await browser.newPage();

                while (true) {
                    try {
                        await page.goto(`http://localhost:3111`);
                        await page.waitForSelector(".ready");
                        break;
                    }
                    catch (error) { }
                }

                await browser.close();
            }, 20_000);

            require('@jest/globals').afterAll(() => {
                killServer();
            });
        });
    }
    else {
        fn();
    }
}

export function it(name, factory, fn) {
    const testName = contextName + '.' + name;
    componentFactories[testName] = factory;

    if (hasJest) {
        return require('@jest/globals').it(name, async () => {
            const browser = await require('puppeteer').launch();

            try {
                const page = await browser.newPage();
                await page.goto(`http://localhost:3111?${new URLSearchParams({ testName })}`);
                await fn(page);
            }
            finally {
                await browser.close();
            }
        });
    }
}