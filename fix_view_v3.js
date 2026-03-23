const fs = require('fs');
const filePath = 'c:\\Users\\user\\Desktop\\vs\\kosha-ms\\src\\app\\page.js';
let content = fs.readFileSync(filePath, 'utf8');

// Use regex to find the div after group/stitle
content = content.replace(/(group\/stitle">\s*)<div>/g, '$1<div className="cursor-pointer flex-1 overflow-hidden" onClick={(e) => handleFileView(e, std.id)}>');

// Use regex to find the div after group/dtitle
content = content.replace(/(group\/dtitle">\s*)<div>/g, '$1<div className="cursor-pointer flex-1 overflow-hidden" onClick={(e) => handleFileView(e, doc.id)}>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Regex replace finished');
