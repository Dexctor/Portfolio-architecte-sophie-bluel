


 export function createLabel(text, forId, labelId) {
    const label = document.createElement('label');
    label.innerText = text;
    label.setAttribute('for', forId);
    label.setAttribute('id', labelId);
    return label;
 }

 