import fs from 'node:fs/promises';

const paths={
 phone:'<path d="M19 13l6 7-4 5c3 6 7 10 13 13l5-4 7 6-3 7c-2 4-13 0-22-9S8 18 12 16z"/>',
 headset:'<path d="M14 33v-4a18 18 0 0136 0v4M14 30h7v15h-7zM43 30h7v15h-7zM47 45c0 6-6 8-15 8"/>',
 kakao:'<path d="M12 18h40v26H30l-10 8 2-8H12z"/><text x="32" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#2c2516" stroke="none">TALK</text>',
 chat:'<path d="M12 17h40v29H29l-9 8v-8h-8z"/><path d="M22 27v10m10-10v10m10-10v10" stroke="#27bd77"/>',
 anonymous:'<path d="M14 35c0-9 8-15 18-15s18 6 18 15-8 15-18 15h-8l-9 5 2-10"/><path d="M28 29a5 5 0 019-1c3 5-5 6-5 10m0 5v1" stroke="#6154d9"/>'
};
const colors={phone:'#1265ee',headset:'#292929',kakao:'#ffe000',chat:'#27bd77',anonymous:'#6154d9'};
await fs.mkdir('assets/quick-flat',{recursive:true});
for(const [name,content] of Object.entries(paths)){
 const fill=['phone','kakao','chat','anonymous'].includes(name)?'#fff':'none';
 // Scale the symbol independently of its circle, including its stroke and speech tail.
 const offset=name==='phone'?'9.4 7.04':name==='headset'?'7.04 7.04':'7.04 5.04';
 await fs.writeFile('assets/quick-flat/'+name+'.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="'+colors[name]+'"/><g transform="translate('+offset+') scale(.78)" fill="'+fill+'" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'+content+'</g></svg>\n');
}
const icons={
 clock:['#168fe5','<circle cx="32" cy="32" r="17"/><path d="M32 21v12l9 5"/>'],
 sms:['#06b5c9','<path d="M15 16h34v28H29l-10 7v-7h-4z"/><path d="M23 26h18M23 34h13"/>'],
 remote:['#8a59e9','<rect x="8" y="14" width="29" height="23" rx="2"/><rect x="29" y="29" width="27" height="21" rx="2"/><path d="M14 45h15M22 37v8"/>'],
 storage:['#21a7e9','<path d="M17 44a10 10 0 01-1-20 16 16 0 0130-1 11 11 0 012 21z"/>'],
 office:['#21c7bc','<path d="M17 10h23l9 9v35H17zM40 10v12h9M24 32l4 12 5-9 5 9 4-12"/>'],
 crm:['#258fe7','<circle cx="32" cy="23" r="9"/><path d="M15 51v-7c0-12 34-12 34 0v7M12 17h5M47 17h5"/>'],
 factoring:['#ce9b2d','<ellipse cx="23" cy="22" rx="12" ry="6"/><path d="M11 22v21c0 8 24 8 24 0V22M11 32c0 8 24 8 24 0"/><circle cx="46" cy="39" r="12"/>'],
 card:['#21cbb4','<rect x="10" y="16" width="44" height="33" rx="4"/><path d="M10 26h44M18 38h12"/>'],
 'card-personal':['#21cbb4','<rect x="10" y="16" width="44" height="33" rx="4"/><circle cx="25" cy="32" r="5"/><path d="M17 43c0-8 16-8 16 0M39 31h8M39 38h8"/>'],
 analytics:['#14c7bc','<path d="M12 48h41M20 44V29h7v15M32 44V17h7v27M44 44V24h7v20"/>'],
 builder:['#2bc5c5','<rect x="10" y="13" width="44" height="38" rx="3"/><path d="M10 23h44M20 18h1M28 18h1M27 42l17-17 5 5-17 17-7 2z"/>'],
 edge:['#9258ea','<rect x="11" y="12" width="42" height="39" rx="3"/><path d="M19 23h25M32 23v20M24 43h16"/>'],
 ledger:['#278fe8','<path d="M16 12h33v41H16zM24 24h17M24 33h17M24 42h17M12 20h8M12 31h8M12 42h8"/>']
};
await fs.mkdir('assets/service-icons',{recursive:true});
for(const [name,[color,content]] of Object.entries(icons))await fs.writeFile('assets/service-icons/'+name+'.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="'+color+'"/><g fill="none" stroke="#fff" stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round">'+content+'</g></svg>\n');
console.log('Flat quick-menu and supplementary service icons built.');
