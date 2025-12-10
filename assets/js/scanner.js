(function(){
  // Helper global para lectores que emulan teclado y envían Enter como sufijo.
  // Crea un input oculto (`#barcodeInput`) que captura el escaneo y emite:
  // - evento global `window.dispatchEvent(new CustomEvent('barcodeScanned', {detail:{code}}))`
  // - invoca `window.onBarcodeScanned(code)` si existe

  function ensureInput(){
    let input = document.getElementById('barcodeInput');
    if(!input){
      input = document.createElement('input');
      input.id = 'barcodeInput';
      input.autocomplete = 'off';
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      input.style.top = '0';
      input.style.opacity = '0';
      input.setAttribute('aria-hidden','true');
      document.body.appendChild(input);
    }
    return input;
  }

  function init(){
    const input = ensureInput();
    try{ input.focus(); }catch(e){}
    // re-enfocar si el usuario hace click en la página
    window.addEventListener('click', ()=>{ try{ input.focus(); }catch(e){} });

    input.addEventListener('keydown', async (ev)=>{
      if(ev.key === 'Enter'){
        const code = input.value.trim();
        input.value = '';
        if(!code) { setTimeout(()=>input.focus(),10); return; }
        // emitir evento
        try{
          window.dispatchEvent(new CustomEvent('barcodeScanned', { detail: { code } }));
        }catch(e){ console.warn('No se pudo despachar evento barcodeScanned', e); }
        // invocar handler global si existe
        if(typeof window.onBarcodeScanned === 'function'){
          try{ await window.onBarcodeScanned(code); }catch(err){ console.error('onBarcodeScanned error', err); }
        }
        // volver a enfocar
        setTimeout(()=>{ try{ input.focus(); }catch(e){} }, 10);
      }
    });

    // opcional: exponer una función para enfocar manualmente
    window.focusBarcodeInput = function(){ try{ ensureInput().focus(); }catch(e){} };
  }

  // Exponer helper para abrir la vista de creación de producto desde otras vistas.
  // Guarda datos iniciales en localStorage y redirige a la vista de productos.
  window.showCreateProductForm = function(initial){
    try{
      if(initial && typeof initial === 'object') localStorage.setItem('createProductInitial', JSON.stringify(initial));
      // redirigir a la vista de productos
      // intentar usar hash router si está presente
      if(location.hash && location.hash.indexOf('#')===0){
        location.hash = '#/productos';
      } else {
        // abrir la página de productos directamente
        location.href = 'views/productos.html';
      }
    }catch(e){ console.error('showCreateProductForm', e); }
  };

  // Inicializar cuando el DOM esté listo
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
