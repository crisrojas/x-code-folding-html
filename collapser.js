	
const storedContents = new Map();

document.querySelectorAll('.line-number[data-start-line]').forEach(function (endLine) {
    endLine.addEventListener('click', function () {
				const endLineId = endLine.innerText
        const startLineId = endLine.getAttribute('data-start-line');
        const endElement = endLine.parentElement;
				const startElement = document.getElementById(startLineId);
        const startLine = document.querySelector(`[data-enclosing-line="${endLineId}"]`);
        const codeContainer = endElement.parentElement;
        
        const affectedNodes = [];
        let shouldCollect = false;
        
        for (let node of codeContainer.childNodes) {
            if (node === startElement) {
                shouldCollect = true;
                continue;
            }
            
            if (shouldCollect) {
                if (node === endElement) {
                    break;
                }
                affectedNodes.push(node);
            }
        }
				
				const isCurrentlyHidden = storedContents.has(startLine);
				if (isCurrentlyHidden) {
					affectedNodes.forEach(node => {
						show(node, startLine)
						endLine.classList.remove('folded')
					})
				}
			
    });
});
	
	document.querySelectorAll('.line-number[data-enclosing-line]').forEach(function (startLine) {
	 
    const endLineId = startLine.getAttribute('data-enclosing-line');
    const startElement = startLine.parentElement;
    const endElement = document.getElementById(endLineId);
		
		
		const startElementId = startLine.innerText;
		const endElementLineNumber = document.querySelector(`[data-start-line="${startElementId}"]`);

    const codeContainer = startElement.parentElement;
   
    startLine.addEventListener('click', function () {
				
        // Colección de nodos a ocultar/mostrar
        const affectedNodes = [];
        let shouldCollect = false;
        
        // Recolectar todos los nodos entre start y end
        for (let node of codeContainer.childNodes) {
						// Si es el elemento en el que hemos clcikeado, le decimos al bucle que
						// debemos empezar a recolectar
            if (node === startElement) {
                shouldCollect = true;
                continue;
            }
            
						// Si debemos recolectar, añadimos los nodos en un array
            if (shouldCollect) {
								// Si es el último elemento rompemos el ciclo.
                if (node === endElement) {
                    //affectedNodes.push(node);
                    break;
                }
                affectedNodes.push(node);
            }
        }
        
        // Comprobar estado actual usando el primer nodo como referencia
        const isCurrentlyHidden = storedContents.has(startLine);
        if (isCurrentlyHidden) {
            // Si los elementos están ocultos, los desocultamos
            affectedNodes.forEach(node => {
							show(node, startLine);
							endElementLineNumber.classList.remove('folded');
						});
        } else {
			
            // Si los elementos no están ocultos, ocultamos:
            affectedNodes.forEach(node => {
							endElementLineNumber.classList.toggle('folded');
							hide(node, startLine)
            });
    
				}
    });
});

// Helpers
function hide(node, startLine) {
	// Si el nodo es un nodo de texto
	// lo almacenamos en el array y eliminamos su contenido
	if (node.nodeType === Node.TEXT_NODE) {
	    storedContents.set(node, node.textContent);
	    node.textContent = '';
			
	// Si no es un nodo de texto,
	// le añadimos la clase "hidden"
	} else {
	    node.classList.add('hidden');
	   // if (!storedContents.has(startLine)) {
	        storedContents.set(startLine, true);
	    //}
	}
}

function show(node, startLine) {
	if (node.nodeType === Node.TEXT_NODE) {
		node.textContent = storedContents.get(node);
		storedContents.delete(node);
	} else {
		node.classList.remove('hidden');
	}
	storedContents.delete(startLine); 
}