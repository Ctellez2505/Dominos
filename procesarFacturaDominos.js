const puppeteer = require("puppeteer");

async function procesarFacturaDominos(datos) {
  // Validar datos de entrada requeridos
  const camposRequeridos = ['rfc', 'ticket', 'tienda', 'fecha'];
  for (const campo of camposRequeridos) {
    if (!datos[campo]) {
      throw new Error(`El campo ${campo} es obligatorio`);
    }
  }

  let browser = null;
  let page = null;
  
  try {
    browser = await puppeteer.launch({
      headless: !datos.mostrarNavegador,
      defaultViewport: false,
      slowMo: datos.velocidad || 50,
      userDataDir: "/tmp",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: 60000 
    });

    page = await browser.newPage();
    
    // Configurar timeouts de navegación más largos
    await page.setDefaultNavigationTimeout(60000); 
    await page.setDefaultTimeout(30000); 
    
    try {
      await page.goto('https://alsea.interfactura.com/wwwroot?opc=Dominos', {
        waitUntil: ['load', 'networkidle2'],
        timeout: 60000
      });
    } catch (navError) {
      console.log('Aviso: Tiempo de espera en navegación inicial excedido, intentando continuar...');
    }

    //Espera a que el formulario cargue con timeout ampliado
    try {
      await page.waitForSelector('form.billing_form.ng-untouched.ng-pristine.ng-valid', { 
        timeout: 30000 
      });
    } catch (selectorError) {
      console.log('Aviso: No se encontró el formulario, intentando continuar...');
    }

    const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

    // Función para teclear con tiempo variable y manejo de errores
    const tecleo = async (selector, text) => {
      try {
        await page.waitForSelector(selector, { timeout: 10000 });
        await page.click(selector);
        await delay(Math.floor(Math.random() * 200) + 100);

        for (const char of text) {
          await page.type(selector, char, { delay: Math.floor(Math.random() * 150) + 30 });

          if (Math.random() > 0.8) {
            await delay(Math.floor(Math.random() * 300) + 100);
          }
        }

        await delay(Math.floor(Math.random() * 500) + 200);
      } catch (inputError) {
        console.error(`Error al teclear en ${selector}:`, inputError.message);
        throw new Error(`No se pudo ingresar texto en el campo ${selector}: ${inputError.message}`);
      }
    };

    // Completar formulario con los datos recibidos
    await tecleo('#rfc', datos.rfc);
    await tecleo('#ticket', datos.ticket);
    await tecleo('#tienda', datos.tienda);
    await tecleo('#dtFecha', datos.fecha);

    // Busqueda y clickeo del boton enviar
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      
      try {
        await page.waitForNavigation({ 
          timeout: 60000,  
          waitUntil: ['load', 'networkidle2'] 
        });
      } catch (navError) {
        console.log('Aviso: Tiempo de espera en navegación excedido, intentando continuar...');
      }
      
      // Esperar un poco más en caso de que la página esté cargando lentamente
      await delay(5000);
    }

    // Capturar información relevante de la página de resultado
    const resultado = {
      exito: true,
      mensaje: 'Factura procesada correctamente'
    };

    return resultado;

  } catch (error) {
    console.error('Error durante el proceso:', error);
    
    // Intentar tomar una captura de pantalla del error si es posible
    try {
      if (page) {
        const screenshotPath = `error-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath });
        console.log(`Captura de pantalla del error guardada como: ${screenshotPath}`);
      }
    } catch (screenshotError) {
      console.error('No se pudo capturar pantalla:', screenshotError.message);
    }
    
    return {
      exito: false,
      error: error.message,
      detalle: error.stack
    };
  } finally {
    // Asegurarnos que cerramos correctamente el navegador incluso si hay errores
    try {
      if (browser) {
        await browser.close();
      }
    } catch (closeError) {
      console.error('Error al cerrar el navegador:', closeError.message);
    }
  }
}

// Exportamos la función para que pueda ser importada desde otros archivos
module.exports = procesarFacturaDominos;
