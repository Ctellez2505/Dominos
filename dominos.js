const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        slowMo: 50,
        userDataDir: "/tmp"
    });

    try {
        const page = await browser.newPage();
        await page.goto('https://alsea.interfactura.com/wwwroot?opc=Dominos')

        //Espera a que el formilario cargue
        await page.waitForSelector('form.billing_form.ng-untouched.ng-pristine.ng-valid');

        const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

        // Función para teclear con tiempo variable
        const tecleo = async (selector, text) => {
            await page.click(selector);

            await delay(Math.floor(Math.random() * 200) + 100);

            for (const char of text) {
                await page.type(selector, char, { delay: Math.floor(Math.random() * 150) + 30 });

                if (Math.random() > 0.8) {
                    await delay(Math.floor(Math.random() * 300) + 100);
                }
            }

            await delay(Math.floor(Math.random() * 500) + 200);
        };

        await tecleo('#rfc', 'HH010580P');
        await tecleo('#ticket', '012345678');
        await tecleo('#tienda', '01112');
        await tecleo('#dtFecha', '01/12/2024');

        // Busqueda y clickeo del boton enviar
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
            await submitButton.click();
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
        }

    } catch (error) {
        console.error('Ocurrió un error:', error);
    } finally {
        console.log("se envio");
        //await browser.close();
    }
})();