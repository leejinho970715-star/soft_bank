import fs from 'node:fs';
import {load} from 'cheerio';
import assert from 'node:assert/strict';
const $=load(fs.readFileSync('subpages/product/nonprofit/intro.html','utf8'));
const normalize=s=>s.replace(/\s+/g,'');
for(const tab of ['groupware','accounting','hr','docs']){
 const original=load(fs.readFileSync('reference/nonprofit-tabs/'+tab+'.html','utf8'));
 const source=original('.contWrap.amaranth10').first();
 const target=$('[data-np-page="'+tab+'"]');
 assert.equal(normalize(target.text()),normalize(source.text()),tab+' content differs');
 assert.equal(target.find('.sb-design-mockup').length,source.find('.img img').length,tab+' images missing');
 assert.deepEqual(target.find('a').map((i,e)=>$(e).attr('href')).get(),source.find('a').map((i,e)=>original(e).attr('href')).get(),tab+' links differ');
 console.log(tab+': text, images and video links preserved ('+target.find('.sb-feature').length+' sections)');
}
