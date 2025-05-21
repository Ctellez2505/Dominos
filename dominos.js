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

/*

Falta el package.json, no se puede ejecutar el código sin él.

A Mejorar:

1. Convierte esto en una función que pueda recibir parámetros y ser importada desde otros archivos.

2. Los datos (RFC, ticket, tienda, fecha) deben recibirse como un objeto JavaScript con los parámetros necesarios.
   Ejemplo: { rfc: 'HH010580P', ticket: '012345678', tienda: '01112', fecha: '01/12/2024' }

3. El browser.close() está comentado en el bloque finally. Siempre debes cerrar el navegador al terminar para evitar fugas de memoria.

4. No hay verificación del resultado (éxito/fracaso) ni devolución de información sobre lo ocurrido.

5. IMPORTANTE: Implementa un sistema de logs para registrar cada paso del proceso.
   Esto facilita la depuración y el seguimiento de la ejecución. Puedes usar 
   console.log o una librería como winston para logs más estructurados.

Resumen:
- Refactoriza este código para crear una función llamada 'procesarFacturaDominos' 
  que reciba un objeto JavaScript con los datos necesarios y devuelva una promesa con el 
  resultado del proceso.
- La función debería poder usarse así:
  procesarFacturaDominos({
    rfc: 'HH010580P',
    ticket: '012345678',
    tienda: '01112',
    fecha: '01/12/2024'
  }).then(resultado => console.log(resultado));
- Incluye validación de los datos recibidos antes de iniciar el proceso.
- Agrega logs al inicio y fin de cada operación importante para facilitar el seguimiento.
*/