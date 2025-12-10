(function(){
  // Global helper for barcode readers that emulate a keyboard and append Enter.
  // Creates a hidden input (`#barcodeInput`) that captures the scan and emits:
  // - global event: `window.dispatchEvent(new CustomEvent('barcodeScanned', {detail:{code}}))`
  // - calls `window.onBarcodeScanned(code)` if present

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
    // re-focus if user clicks anywhere on the page
    window.addEventListener('click', ()=>{ try{ input.focus(); }catch(e){} });

    input.addEventListener('keydown', async (ev)=>{
      if(ev.key === 'Enter'){
        const code = input.value.trim();
        input.value = '';
        if(!code) { setTimeout(()=>input.focus(),10); return; }
        // dispatch event
        try{
          window.dispatchEvent(new CustomEvent('barcodeScanned', { detail: { code } }));
        }catch(e){ console.warn('Failed to dispatch barcodeScanned', e); }
        // invoke global handler if present
        if(typeof window.onBarcodeScanned === 'function'){
          try{ await window.onBarcodeScanned(code); }catch(err){ console.error('onBarcodeScanned error', err); }
        }
        // refocus hidden input
        setTimeout(()=>{ try{ input.focus(); }catch(e){} }, 10);
      }
    });

    // optional: expose a function for manual focus
    window.focusBarcodeInput = function(){ try{ ensureInput().focus(); }catch(e){} };
  }

  // Expose helper to open product creation view from other views.
  // Stores initial data in localStorage and redirects to Products view.
  window.showCreateProductForm = function(initial){
    try{
      if(initial && typeof initial === 'object') localStorage.setItem('createProductInitial', JSON.stringify(initial));
      // redirect to Products view
      // try to use hash router if present
      if(location.hash && location.hash.indexOf('#')===0){
        location.hash = '#/productos';
      } else {
        // open Products page directly
        location.href = 'views/productos.html';
      }
    }catch(e){ console.error('showCreateProductForm', e); }
  };

  // Initialize when DOM is ready
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
