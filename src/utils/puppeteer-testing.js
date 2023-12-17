export const isTestServer = typeof jest !== 'undefined';

export const componentFactories = {};
let contextName = '';

const child_process = isTestServer ? require(['child_process'][0]) : null;
const jest_globals = isTestServer ? require(['@jest/globals'][0]) : null;
const puppeteer = isTestServer ? require(['puppeteer'][0]) : null;

const killServer = () => {
    try { child_process.execSync('kill $(lsof -t -i:3111)'); }
    catch (error) { }
}

export function beforeAll(fn) {
    if (isTestServer) {
        return jest_globals.beforeAll(fn);
    }
}

export function describe(name, fn) {
    contextName = name;

    if (isTestServer) {
        jest_globals.describe(name, () => {
            fn();

            jest_globals.beforeAll(async () => {
                killServer();

                child_process.exec('npm start', {
                    cwd: process.cwd() + '/test-env',
                    env: {
                        ...process.env,
                        REACT_APP_FILE_NAME: module.parent.filename.replace(process.cwd() + '/', './'),
                        PORT: 3111
                    }
                });

                const browser = await puppeteer.launch();
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

            jest_globals.afterAll(() => {
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

    if (isTestServer) {
        return jest_globals.it(name, async () => {
            const browser = await puppeteer.launch();

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