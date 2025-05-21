/**
 * Script para enviar datos de factura Domino's Pizza
 * 
 * Este archivo utiliza la función procesarFacturaDominos para enviar 
 * los datos necesarios para generar una factura en el sistema Alsea Interfactura.
 */

// Importamos la función desde el archivo principal
const procesarFacturaDominos = require('./procesarFacturaDominos');

// Configuración de datos para la factura
const datosDeLaFactura = {
  rfc: 'HH010580P',
  ticket: '012345678',
  tienda: '01112',
  fecha: '01/12/2024',
  mostrarNavegador: true,  
  velocidad: 100  
};

// Función principal que ejecuta el proceso
async function ejecutarProceso() {
  console.log('Iniciando proceso de facturación...');
  console.log('Datos a procesar:', datosDeLaFactura);
  
  try {
    // Llamamos a la función y esperamos el resultado
    const resultado = await procesarFacturaDominos(datosDeLaFactura);
    
    // Procesamos el resultado
    if (resultado.exito) {
      console.log('✅ Factura procesada correctamente');
      console.log('Detalles:', resultado);
    } else {
      console.log('❌ Error al procesar la factura');
      console.log('Mensaje de error:', resultado.error);
      console.log('Detalles:', resultado);
    }
    
    return resultado;
  } catch (error) {
    console.error('❌ Ocurrió un error grave durante el proceso:');
    console.error(error);
    process.exit(1); // Salir con error
  }
}

// Si este archivo se ejecuta directamente (no es importado)
if (require.main === module) {
  // Notificamos el inicio del proceso
  console.log('='.repeat(50));
  console.log(' SISTEMA DE FACTURACIÓN DOMINO\'S PIZZA');
  console.log('='.repeat(50));
  
  // Ejecutamos el proceso principal
  ejecutarProceso()
    .then(resultado => {
      // Terminamos el proceso correctamente
      if (resultado.exito) {
        process.exit(0); // Salir sin error
      } else {
        process.exit(1); // Salir con error
      }
    })
    .catch(error => {
      console.error('Error inesperado:', error);
      process.exit(1); // Salir con error
    });
}

// También exportamos la función principal para poder usarla desde otros archivos
module.exports = ejecutarProceso;


/*
Mejoras:

ESTRUCTURA DE DATOS:

Elimina los parámetros "mostrarNavegador" y "velocidad" del objeto de datos.
El objeto facturaData debe contener SOLO datos relevantes para la factura (rfc, ticket, tienda, fecha).
El navegador siempre debe mostrarse (headless: false), no debe ser configurable.


SISTEMA DE LOGS MEJORADO:

Agrega timestamp a cada mensaje de log:
console.log([${new Date().toISOString()}] Iniciando proceso...);
Usa formato consistente para todos los mensajes (evita mezclar emojis con texto plano)
Diferencia claramente tipos de mensajes (INFO, WARN, ERROR)


ORGANIZACIÓN DE CAPTURAS DE ERROR:

Crea una estructura de carpetas para las capturas de pantalla:
const screenshotsDir = ./screenshots/${YYYY-MM-DD};
Guarda capturas con nombres descriptivos que incluyan timestamp
Ejemplo:
const screenshotPath = ${screenshotsDir}/error-${hora-minuto-segundo}.png;

SEGURIDAD ANTI-DETECCIÓN:

Implementa puppeteer-extra con StealthPlugin para evitar la detección de bots:
const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(StealthPlugin());
Configura un user-agent personalizado.
Oculta propiedades que revelan automatización:
await page.evaluateOnNewDocument(() => {
Object.defineProperty(navigator, 'webdriver', { get: () => false });
});
*/