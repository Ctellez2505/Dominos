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
